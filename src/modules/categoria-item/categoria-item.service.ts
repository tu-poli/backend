import { Injectable } from '@nestjs/common';
import { CreateCategoriaItemDto } from './dto/create-categoria-item.dto';
import { UpdateCategoriaItemDto } from './dto/update-categoria-item.dto';

@Injectable()
export class CategoriaItemService {
  create(createCategoriaItemDto: CreateCategoriaItemDto) {
    return 'This action adds a new categoriaItem';
  }

  findAll() {
    return `This action returns all categoriaItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriaItem`;
  }

  update(id: number, updateCategoriaItemDto: UpdateCategoriaItemDto) {
    return `This action updates a #${id} categoriaItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriaItem`;
  }
}
