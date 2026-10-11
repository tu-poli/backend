import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoriaActividadDto } from "./dto/create-categoria-actividad.dto";
import { UpdateCategoriaActividadDto } from "./dto/update-categoria-actividad.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CategoriaActividadService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear una categoría, valida unicidad sin discriminar mayúsculas/minúsculas
  async create(createCategoriaActividadDto: CreateCategoriaActividadDto) {
    const nombreLimpio = createCategoriaActividadDto.nombre.trim();

    await this.validarNombreUnico(nombreLimpio);

    return this.prisma.categoriaActividad.create({
      data: {
        ...createCategoriaActividadDto,
        nombre: nombreLimpio,
      },
    });
  }

  // Listar o consultar categorías sin discriminar mayúsculas ni minúsculas
  async findAll(nombre?: string) {
    if (!nombre) {
      return this.prisma.categoriaActividad.findMany();
    }

    const term = nombre.trim();

    // Buscar categorías coincidentes por término
    const resultados = await this.prisma.categoriaActividad.findMany({
      where: {
        nombre: {
          contains: term,
        },
      },
    });

    if (resultados.length > 0) {
      return resultados;
    }

    // Respaldo para garantizar coincidencia sin distinción de mayúsculas/minúsculas
    const todas = await this.prisma.categoriaActividad.findMany();
    return todas.filter((cat) =>
      cat.nombre.toLowerCase().includes(term.toLowerCase()),
    );
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoriaActividad.findUnique({
      where: { id_categoria: id },
    });
    if (!categoria) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }
    return categoria;
  }

  async update(
    id: number,
    updateCategoriaActividadDto: UpdateCategoriaActividadDto,
  ) {
    await this.findOne(id); // Verifica si existe

    const data: UpdateCategoriaActividadDto = {
      ...updateCategoriaActividadDto,
    };

    if (updateCategoriaActividadDto.nombre) {
      const nombreLimpio = updateCategoriaActividadDto.nombre.trim();
      await this.validarNombreUnico(nombreLimpio, id);
      data.nombre = nombreLimpio;
    }

    return this.prisma.categoriaActividad.update({
      where: { id_categoria: id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verifica si existe
    return this.prisma.categoriaActividad.delete({
      where: { id_categoria: id },
    });
  }

  // Verifica que el nombre no exista ya en otra categoría (sin discriminar mayúsculas y minúsculas)
  private async validarNombreUnico(nombre: string, idExcluir?: number) {
    // 1. Verificación directa en base de datos
    const existenteDirecto = await this.prisma.categoriaActividad.findFirst({
      where: {
        nombre: { equals: nombre },
        ...(idExcluir ? { NOT: { id_categoria: idExcluir } } : {}),
      },
    });

    if (existenteDirecto) {
      throw new ConflictException(
        `Ya existe una categoría de actividad con el nombre "${nombre}"`,
      );
    }

    // 2. Respaldo insensible a mayúsculas/minúsculas en memoria
    const todas = await this.prisma.categoriaActividad.findMany({
      where: idExcluir ? { NOT: { id_categoria: idExcluir } } : undefined,
    });

    const duplicado = todas.find(
      (c) => c.nombre.trim().toLowerCase() === nombre.toLowerCase(),
    );

    if (duplicado) {
      throw new ConflictException(
        `Ya existe una categoría de actividad con el nombre "${nombre}"`,
      );
    }
  }
}
