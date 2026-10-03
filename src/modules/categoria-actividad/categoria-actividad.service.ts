import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoriaActividadDto } from "./dto/create-categoria-actividad.dto";
import { UpdateCategoriaActividadDto } from "./dto/update-categoria-actividad.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CategoriaActividadService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear una categoria, recibe el DTO para validar sus datos
  async create(createCategoriaActividadDto: CreateCategoriaActividadDto) {
    return this.prisma.categoriaActividad.create({
      data: createCategoriaActividadDto,
    });
  }

  async findAll(nombre?: string) {
    return this.prisma.categoriaActividad.findMany({
      where: nombre ? { nombre: { contains: nombre } } : undefined,
    });
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
    return this.prisma.categoriaActividad.update({
      where: { id_categoria: id },
      data: updateCategoriaActividadDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verifica si existe
    return this.prisma.categoriaActividad.delete({
      where: { id_categoria: id },
    });
  }
}
