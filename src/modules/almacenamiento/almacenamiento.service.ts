import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export enum BucketAlmacenamiento {
  DOCUMENTACION_MEDICA = "documentacion_medica",
  AUTORIZACIONES = "autorizaciones",
}

@Injectable()
export class AlmacenamientoService {
  private readonly logger = new Logger(AlmacenamientoService.name);
  private readonly clienteSupabase: SupabaseClient;

  public readonly bucketDocumentacionMedica: string;
  public readonly bucketAutorizaciones: string;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>("SUPABASE_URL") || "";
    // Se prioriza SUPABASE_SECRET_KEY para operaciones seguras de backend con Supabase Storage
    const clave =
      this.configService.get<string>("SUPABASE_SECRET_KEY") ||
      this.configService.get<string>("SUPABASE_KEY") ||
      this.configService.get<string>("SUPABASE_PUBLISHABLE_KEY") ||
      "";

    this.bucketDocumentacionMedica =
      this.configService.get<string>("SUPABASE_BUCKET_DOCUMENTACION_MEDICA") ||
      BucketAlmacenamiento.DOCUMENTACION_MEDICA;

    this.bucketAutorizaciones =
      this.configService.get<string>("SUPABASE_BUCKET_AUTORIZACIONES") ||
      BucketAlmacenamiento.AUTORIZACIONES;

    if (!url || !clave) {
      this.logger.warn(
        "Aviso: Supabase Storage no cuenta con SUPABASE_URL o SUPABASE_SECRET_KEY/SUPABASE_KEY configuradas. Las operaciones de almacenamiento fallarán hasta que se definan en las variables de entorno.",
      );
    }

    this.clienteSupabase = createClient(url, clave, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  /**
   * Sanitiza la ruta de destino para prevenir ataques de Path Traversal (../) y caracteres no permitidos.
   */
  sanitizarRuta(ruta: string): string {
    return ruta
      .replace(/\.\./g, "")
      .replace(/[^a-zA-Z0-9_\-\/\.]/g, "_")
      .replace(/\/+/g, "/");
  }

  /**
   * Sube un archivo a un bucket de Supabase Storage.
   * IMPORTANTE - SEGURIDAD:
   * Los documentos de menores (fichas médicas, CUD, autorizaciones) deben residir en buckets
   * PRIVADOS. Se debe almacenar en la base de datos la 'ruta' (path) relativa y utilizar
   * `obtenerUrlFirmada()` para otorgar acceso temporal sólo a usuarios autorizados.
   *
   * @param archivo Archivo proveniente de Express.Multer.File
   * @param rutaDestino Ruta/nombre dentro del bucket (ej: "fichas/menor_123.pdf")
   * @param bucket Nombre del bucket ('documentacion_medica' o 'autorizaciones')
   */
  async subirArchivo(
    archivo: Express.Multer.File,
    rutaDestino: string,
    bucket:
      BucketAlmacenamiento | string = BucketAlmacenamiento.DOCUMENTACION_MEDICA,
  ): Promise<{ ruta: string; urlPublica: string }> {
    const rutaSegura = this.sanitizarRuta(rutaDestino);

    const { data, error } = await this.clienteSupabase.storage
      .from(bucket)
      .upload(rutaSegura, archivo.buffer, {
        contentType: archivo.mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(
        `Error al subir archivo al bucket "${bucket}": ${error.message}`,
        error,
      );
      throw new InternalServerErrorException(
        `Error al almacenar el archivo en Supabase: ${error.message}`,
      );
    }

    const { data: dataUrl } = this.clienteSupabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      ruta: data.path,
      urlPublica: dataUrl.publicUrl,
    };
  }

  /**
   * Sube un documento médico (ficha médica o CUD) al bucket 'documentacion_medica'.
   */
  async subirDocumentacionMedica(
    archivo: Express.Multer.File,
    rutaDestino: string,
  ): Promise<{ ruta: string; urlPublica: string }> {
    return this.subirArchivo(
      archivo,
      rutaDestino,
      this.bucketDocumentacionMedica,
    );
  }

  /**
   * Sube una autorización firmada al bucket 'autorizaciones'.
   */
  async subirAutorizacion(
    archivo: Express.Multer.File,
    rutaDestino: string,
  ): Promise<{ ruta: string; urlPublica: string }> {
    return this.subirArchivo(archivo, rutaDestino, this.bucketAutorizaciones);
  }

  /**
   * Obtiene la URL pública de un archivo en Supabase Storage.
   */
  obtenerUrlPublica(
    ruta: string,
    bucket:
      BucketAlmacenamiento | string = BucketAlmacenamiento.DOCUMENTACION_MEDICA,
  ): string {
    const { data } = this.clienteSupabase.storage
      .from(bucket)
      .getPublicUrl(ruta);
    return data.publicUrl;
  }

  /**
   * Genera una URL firmada temporal para acceder a archivos privados (ej. documentación médica o autorizaciones sensibles).
   * @param ruta Ruta del archivo en el bucket
   * @param segundosExpiracion Duración de validez en segundos (por defecto 3600 = 1 hora)
   * @param bucket Nombre del bucket
   */
  async obtenerUrlFirmada(
    ruta: string,
    segundosExpiracion: number = 3600,
    bucket:
      BucketAlmacenamiento | string = BucketAlmacenamiento.DOCUMENTACION_MEDICA,
  ): Promise<string> {
    const { data, error } = await this.clienteSupabase.storage
      .from(bucket)
      .createSignedUrl(ruta, segundosExpiracion);

    if (error) {
      this.logger.error(
        `Error al generar URL firmada para bucket "${bucket}": ${error.message}`,
        error,
      );
      throw new InternalServerErrorException(
        `Error al generar enlace seguro de acceso: ${error.message}`,
      );
    }

    return data.signedUrl;
  }

  /**
   * Elimina un archivo de Supabase Storage.
   */
  async eliminarArchivo(
    ruta: string,
    bucket:
      BucketAlmacenamiento | string = BucketAlmacenamiento.DOCUMENTACION_MEDICA,
  ): Promise<void> {
    const { error } = await this.clienteSupabase.storage
      .from(bucket)
      .remove([ruta]);

    if (error) {
      this.logger.error(
        `Error al eliminar archivo en bucket "${bucket}": ${error.message}`,
        error,
      );
      throw new InternalServerErrorException(
        `Error al eliminar el archivo de Supabase: ${error.message}`,
      );
    }
  }
}
