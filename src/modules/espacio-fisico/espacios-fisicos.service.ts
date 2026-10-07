import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEspacioFisicoDto } from './dto/create-espacio-fisico.dto';
import { UpdateEspacioFisicoDto } from './dto/update-espacio-fisico.dto';

@Injectable()
export class EspaciosFisicosService {
  constructor(private prisma: PrismaService) {}

  async create(createEspacioFisicoDto: CreateEspacioFisicoDto) {
    const nuevoEspacio = await this.prisma.espacioFisico.create({
      data: {
        nombre: createEspacioFisicoDto.nombre,
        descripcion: createEspacioFisicoDto.descripcion,
      },
    });

    return this.mapToDto(nuevoEspacio);
  }

  async findAll() {
    const espacios = await this.prisma.espacioFisico.findMany();
    return espacios.map(espacio => this.mapToDto(espacio));
  }

  async findOne(id: number) {
    const espacio = await this.prisma.espacioFisico.findUnique({
      where: { id_espacio: id },
    });

    if (!espacio) {
      throw new NotFoundException(`Espacio físico con id ${id} no encontrado`);
    }

    return this.mapToDto(espacio);
  }

  async update(id: number, updateEspacioFisicoDto: UpdateEspacioFisicoDto) {
    await this.findOne(id); // verifica si existe

    const data: any = {};
    if (updateEspacioFisicoDto.nombre !== undefined) data.nombre = updateEspacioFisicoDto.nombre;
    if (updateEspacioFisicoDto.descripcion !== undefined) data.descripcion = updateEspacioFisicoDto.descripcion;

    const espacioActualizado = await this.prisma.espacioFisico.update({
      where: { id_espacio: id },
      data,
    });

    return this.mapToDto(espacioActualizado);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.espacioFisico.delete({
      where: { id_espacio: id },
    });
  }

  private mapToDto(espacio: any) {
    return {
      id: espacio.id_espacio,
      nombre: espacio.nombre,
      descripcion: espacio.descripcion,
    };
  }
}
