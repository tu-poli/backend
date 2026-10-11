import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    const { elemento, categoriaId, cantidad, lote, stockMinimo } =
      createItemDto;

    const categoryExists = await this.prisma.categoriaInventario.findUnique({
      where: { id_categoria: categoriaId },
    });
    if (!categoryExists) {
      throw new NotFoundException(
        `Categoria con id ${categoriaId} no encontrada`,
      );
    }

    const newItem = await this.prisma.item.create({
      data: {
        nombre: elemento,
        id_categoria: categoriaId,
        cantidad: cantidad,
        lote: lote,
        stock_minimo: stockMinimo ?? 0,
      },
    });

    return this.mapToDto(newItem);
  }

  async findAll(elemento?: string, categoriaId?: number) {
    const items = await this.prisma.item.findMany({
      where: {
        ...(elemento ? { nombre: { contains: elemento } } : {}),
        ...(categoriaId ? { id_categoria: categoriaId } : {}),
      },
      include: {
        categoria: true,
      },
    });

    return items.map((item) => this.mapToDtoWithCategory(item));
  }

  async findOne(id: number) {
    const item = await this.prisma.item.findUnique({
      where: { id_item: id },
      include: {
        categoria: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Item con id ${id} no encontrado`);
    }

    return this.mapToDtoWithCategory(item);
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    await this.findOne(id); // verifica si existe

    const data: any = {};
    if (updateItemDto.elemento !== undefined)
      data.nombre = updateItemDto.elemento;
    if (updateItemDto.categoriaId !== undefined)
      data.id_categoria = updateItemDto.categoriaId;
    if (updateItemDto.cantidad !== undefined)
      data.cantidad = updateItemDto.cantidad;
    if (updateItemDto.lote !== undefined) data.lote = updateItemDto.lote;
    if (updateItemDto.stockMinimo !== undefined)
      data.stock_minimo = updateItemDto.stockMinimo ?? 0;

    if (updateItemDto.categoriaId !== undefined) {
      const categoryExists = await this.prisma.categoriaInventario.findUnique({
        where: { id_categoria: updateItemDto.categoriaId },
      });
      if (!categoryExists) {
        throw new NotFoundException(
          `Categoria con id ${updateItemDto.categoriaId} no encontrada`,
        );
      }
    }

    const updatedItem = await this.prisma.item.update({
      where: { id_item: id },
      data,
      include: {
        categoria: true,
      },
    });

    return this.mapToDtoWithCategory(updatedItem);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.item.delete({
      where: { id_item: id },
    });
  }

  private mapToDto(item: any) {
    return {
      id: item.id_item,
      elemento: item.nombre,
      categoriaId: item.id_categoria,
      cantidad: item.cantidad,
      lote: item.lote,
      stockMinimo: item.stock_minimo,
    };
  }

  private mapToDtoWithCategory(item: any) {
    return {
      id: item.id_item,
      elemento: item.nombre,
      categoriaId: item.id_categoria,
      categoria: item.categoria
        ? {
            id: item.categoria.id_categoria,
            nombre: item.categoria.nombre,
            color: item.categoria.color,
            icono: item.categoria.icono,
          }
        : null,
      cantidad: item.cantidad,
      lote: item.lote,
      stockMinimo: item.stock_minimo,
    };
  }
}
