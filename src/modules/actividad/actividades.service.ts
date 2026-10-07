import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateActividadDto } from "./dto/create-actividad.dto";
import { UpdateActividadDto } from "./dto/update-actividad.dto";

@Injectable()
export class ActividadesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createActividadDto: CreateActividadDto) {
    const { nombre, descripcion, categoriaId, requiereAutorizacion } =
      createActividadDto;

    // Validación: No repetir nombres de actividades exactamente iguales
    const actividadExistente = await this.prisma.actividad.findFirst({
      where: { nombre: nombre },
    });

    if (actividadExistente) {
      throw new ConflictException(
        `Ya existe una actividad registrada con el nombre '${nombre}'.`,
      );
    }

    const categoriaExiste = await this.prisma.categoriaActividad.findUnique({
      where: { id_categoria: categoriaId },
    });

    if (!categoriaExiste) {
      throw new NotFoundException(
        `Categoría de actividad con ID ${categoriaId} no encontrada`,
      );
    }

    const nuevaActividad = await this.prisma.actividad.create({
      data: {
        nombre: nombre,
        descripcion: descripcion ?? null,
        id_categoria: categoriaId,
        requiere_autorizacion: requiereAutorizacion ?? false,
      },
      include: {
        categoria: true,
      },
    });

    return this.mapearDto(nuevaActividad);
  }

  async findAll(
    nombre?: string,
    categoriaId?: number,
    requiereAutorizacion?: boolean,
  ) {
    const actividades = await this.prisma.actividad.findMany({
      where: {
        ...(nombre ? { nombre: { contains: nombre } } : {}),
        ...(categoriaId ? { id_categoria: categoriaId } : {}),
        ...(requiereAutorizacion !== undefined
          ? { requiere_autorizacion: requiereAutorizacion }
          : {}),
      },
      include: {
        categoria: true,
      },
      orderBy: {
        id_actividad: "asc",
      },
    });

    return actividades.map((actividad) => this.mapearDto(actividad));
  }

  async findOne(id: number) {
    const actividad = await this.prisma.actividad.findUnique({
      where: { id_actividad: id },
      include: {
        categoria: true,
      },
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    return this.mapearDto(actividad);
  }

  async update(id: number, updateActividadDto: UpdateActividadDto) {
    await this.findOne(id); // Valida existencia previa

    const { nombre, descripcion, categoriaId, requiereAutorizacion } =
      updateActividadDto;

    // Validación de unicidad si se está modificando el nombre
    if (nombre !== undefined) {
      const actividadExistente = await this.prisma.actividad.findFirst({
        where: { nombre: nombre },
      });

      if (actividadExistente && actividadExistente.id_actividad !== id) {
        throw new ConflictException(
          `Ya existe otra actividad registrada con el nombre '${nombre}'.`,
        );
      }
    }

    if (categoriaId !== undefined) {
      const categoriaExiste = await this.prisma.categoriaActividad.findUnique({
        where: { id_categoria: categoriaId },
      });

      if (!categoriaExiste) {
        throw new NotFoundException(
          `Categoría de actividad con ID ${categoriaId} no encontrada`,
        );
      }
    }

    const data: {
      nombre?: string;
      descripcion?: string | null;
      id_categoria?: number;
      requiere_autorizacion?: boolean;
    } = {};

    if (nombre !== undefined) {
      data.nombre = nombre;
    }
    if (descripcion !== undefined) {
      data.descripcion = descripcion;
    }
    if (categoriaId !== undefined) {
      data.id_categoria = categoriaId;
    }
    if (requiereAutorizacion !== undefined) {
      data.requiere_autorizacion = requiereAutorizacion;
    }

    const actividadActualizada = await this.prisma.actividad.update({
      where: { id_actividad: id },
      data,
      include: {
        categoria: true,
      },
    });

    return this.mapearDto(actividadActualizada);
  }

  async remove(id: number) {
    await this.findOne(id); // Valida existencia previa

    const reservasAsociadas = await this.prisma.reserva.count({
      where: { id_actividad: id },
    });

    if (reservasAsociadas > 0) {
      throw new BadRequestException(
        `No se puede eliminar la actividad porque posee ${reservasAsociadas} reserva(s) asociada(s)`,
      );
    }

    await this.prisma.actividad.delete({
      where: { id_actividad: id },
    });
  }

  private mapearDto(actividad: any) {
    return {
      id: actividad.id_actividad,
      nombre: actividad.nombre,
      descripcion: actividad.descripcion,
      categoriaId: actividad.id_categoria,
      requiereAutorizacion: actividad.requiere_autorizacion,
      categoria: actividad.categoria
        ? {
            id: actividad.categoria.id_categoria,
            nombre: actividad.categoria.nombre,
          }
        : null,
    };
  }
}
