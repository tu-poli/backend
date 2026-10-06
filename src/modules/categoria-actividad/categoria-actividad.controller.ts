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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CategoriaActividadService } from "./categoria-actividad.service";
import { CreateCategoriaActividadDto } from "./dto/create-categoria-actividad.dto";
import { UpdateCategoriaActividadDto } from "./dto/update-categoria-actividad.dto";
import { QueryCategoriaActividadDto } from "./dto/query-categoria-actividad.dto";

@ApiTags("Actividades - Categorías")
@Controller(["actividades/categorias", "categoria-actividad"])
export class CategoriaActividadController {
  constructor(
    private readonly categoriaActividadService: CategoriaActividadService,
  ) {}

  @Post() // CREAR UNA CATEGORIA
  @ApiOperation({ summary: "Registrar una nueva categoría de actividad" })
  @ApiResponse({
    status: 201,
    description: "La categoría ha sido creada exitosamente.",
  })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos." })
  @ApiResponse({
    status: 409,
    description: "Ya existe una categoría con ese nombre.",
  })
  create(@Body() createCategoriaActividadDto: CreateCategoriaActividadDto) {
    return this.categoriaActividadService.create(createCategoriaActividadDto);
  }

  @Get() // OBTENER TODAS LAS CATEGORIAS O FILTRAR POR NOMBRE
  @ApiOperation({ summary: "Listar categorías de actividad" })
  @ApiResponse({
    status: 200,
    description: "Lista de categorías de actividad obtenida exitosamente.",
  })
  @ApiResponse({ status: 400, description: "Parámetro de búsqueda inválido." })
  findAll(@Query() query: QueryCategoriaActividadDto) {
    return this.categoriaActividadService.findAll(query.nombre);
  }

  @Get(":id") // OBTENER UNA UNICA CATEGORIA
  @ApiOperation({ summary: "Obtener una categoría de actividad por ID" })
  @ApiResponse({ status: 200, description: "Categoría encontrada." })
  @ApiResponse({ status: 404, description: "Categoría no encontrada." })
  findOne(@Param("id") id: string) {
    return this.categoriaActividadService.findOne(+id);
  }

  @Patch(":id") // ACTUALIZAR UNA CATEGORIA
  @ApiOperation({ summary: "Actualizar nombre de una categoría de actividad" })
  @ApiResponse({
    status: 200,
    description: "Categoría actualizada exitosamente.",
  })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos." })
  @ApiResponse({ status: 404, description: "Categoría no encontrada." })
  @ApiResponse({
    status: 409,
    description: "Ya existe una categoría con ese nombre.",
  })
  update(
    @Param("id") id: string,
    @Body() updateCategoriaActividadDto: UpdateCategoriaActividadDto,
  ) {
    return this.categoriaActividadService.update(
      +id,
      updateCategoriaActividadDto,
    );
  }

  @Delete(":id") // BORRAR UNA CATEGORIA
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Eliminar una categoría de actividad" })
  @ApiResponse({ status: 204, description: "La categoría ha sido eliminada." })
  @ApiResponse({ status: 404, description: "Categoría no encontrada." })
  remove(@Param("id") id: string) {
    return this.categoriaActividadService.remove(+id);
  }
}
