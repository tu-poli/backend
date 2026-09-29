import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@ApiTags('Inventario')
@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post() // CREAR UN INVENTARIO
  @ApiOperation({ summary: 'Registrar un nuevo inventario' }) // Swagger
  @ApiResponse({ status: 201, description: 'El inventario ha sido creado exitosamente.' }) // Swagger
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventarioService.create(createInventarioDto);
  }

  @Get() // OBTENER TODOS LOS INVENTARIOS
  @ApiOperation({ summary: 'Listar inventarios' })
  @ApiQuery({ name: 'nombre', required: false, description: 'Filtrar por nombre' })
  findAll(@Query('nombre') nombre?: string) {
    return this.inventarioService.findAll(nombre);
  }

  @Get(':id') // OBTENER UN UNICO INVENTARIO
  @ApiOperation({ summary: 'Obtener un inventario por ID' })
  findOne(@Param('id') id: string) {
    return this.inventarioService.findOne(+id);
  }

  @Patch(':id') // ACTUALIZAR UN INVENTARIO
  @ApiOperation({ summary: 'Actualizar un inventario' })
  update(
    @Param('id') id: string,
    @Body() updateInventarioDto: UpdateInventarioDto,
  ) {
    return this.inventarioService.update(+id, updateInventarioDto);
  }

  @Delete(':id') // BORRAR UN INVENTARIO
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un inventario' })
  @ApiResponse({ status: 204, description: 'El inventario ha sido eliminado.' })
  remove(@Param('id') id: string) {
    return this.inventarioService.remove(+id);
  }
}
