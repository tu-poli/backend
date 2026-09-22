import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaItemDto } from './dto/create-categoria-item.dto';
import { UpdateCategoriaItemDto } from './dto/update-categoria-item.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriaItemService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear una categoria, recive el DTO para validar sus datos
  async create(createCategoriaItemDto: CreateCategoriaItemDto) {
    return this.prisma.categoriaInventario.create({
      data: createCategoriaItemDto,
    });
  }

  async findAll(nombre?: string) {
    return this.prisma.categoriaInventario.findMany({
      where: nombre ? { nombre: { contains: nombre } } : undefined,
    });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoriaInventario.findUnique({
      where: { id_categoria: id },
    });
    if (!categoria) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }
    return categoria;
  }

  async update(id: number, updateCategoriaItemDto: UpdateCategoriaItemDto) {
    await this.findOne(id); // Verifica si existe
    return this.prisma.categoriaInventario.update({
      where: { id_categoria: id },
      data: updateCategoriaItemDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verifica si existe
    return this.prisma.categoriaInventario.delete({
      where: { id_categoria: id },
    });
  }
}
