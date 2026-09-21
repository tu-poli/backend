import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaItemService } from './categoria-item.service';
import { CreateCategoriaItemDto } from './dto/create-categoria-item.dto';
import { UpdateCategoriaItemDto } from './dto/update-categoria-item.dto';

@Controller('categoria-item')
export class CategoriaItemController {
  constructor(private readonly categoriaItemService: CategoriaItemService) {}

  @Post()
  create(@Body() createCategoriaItemDto: CreateCategoriaItemDto) {
    return this.categoriaItemService.create(createCategoriaItemDto);
  }

  @Get()
  findAll() {
    return this.categoriaItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaItemDto: UpdateCategoriaItemDto) {
    return this.categoriaItemService.update(+id, updateCategoriaItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaItemService.remove(+id);
  }
}
