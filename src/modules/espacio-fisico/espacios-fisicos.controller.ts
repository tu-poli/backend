import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EspaciosFisicosService } from './espacios-fisicos.service';
import { CreateEspacioFisicoDto } from './dto/create-espacio-fisico.dto';
import { UpdateEspacioFisicoDto } from './dto/update-espacio-fisico.dto';

@ApiTags('Espacios Fisicos')
@Controller('espacios-fisicos')
export class EspaciosFisicosController {
  constructor(private readonly espaciosFisicosService: EspaciosFisicosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo espacio físico' })
  @ApiResponse({ status: 201, description: 'Espacio físico creado exitosamente.' })
  create(@Body() createEspacioFisicoDto: CreateEspacioFisicoDto) {
    return this.espaciosFisicosService.create(createEspacioFisicoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los espacios físicos' })
  findAll() {
    return this.espaciosFisicosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un espacio físico por ID' })
  findOne(@Param('id') id: string) {
    return this.espaciosFisicosService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un espacio físico' })
  update(@Param('id') id: string, @Body() updateEspacioFisicoDto: UpdateEspacioFisicoDto) {
    return this.espaciosFisicosService.update(+id, updateEspacioFisicoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un espacio físico' })
  remove(@Param('id') id: string) {
    return this.espaciosFisicosService.remove(+id);
  }
}
