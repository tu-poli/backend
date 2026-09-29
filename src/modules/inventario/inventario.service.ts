import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventarioService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear un inventario, recibe el DTO para validar sus datos
  async create(createInventarioDto: CreateInventarioDto) {
    return this.prisma.inventario.create({
      data: createInventarioDto,
    });
  }

  async findAll(nombre?: string) {
    return this.prisma.inventario.findMany({
      where: nombre ? { nombre: { contains: nombre } } : undefined,
    });
  }

  async findOne(id: number) {
    const inventario = await this.prisma.inventario.findUnique({
      where: { id_inventario: id },
    });
    if (!inventario) {
      throw new NotFoundException(`Inventario con id ${id} no encontrado`);
    }
    return inventario;
  }

  async update(id: number, updateInventarioDto: UpdateInventarioDto) {
    await this.findOne(id); // Verifica si existe
    return this.prisma.inventario.update({
      where: { id_inventario: id },
      data: updateInventarioDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verifica si existe
    return this.prisma.inventario.delete({
      where: { id_inventario: id },
    });
  }
}
