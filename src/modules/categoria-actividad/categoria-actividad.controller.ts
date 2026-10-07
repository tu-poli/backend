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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { CategoriaActividadService } from "./categoria-actividad.service";
import { CreateCategoriaActividadDto } from "./dto/create-categoria-actividad.dto";
import { UpdateCategoriaActividadDto } from "./dto/update-categoria-actividad.dto";

@ApiTags("Actividades - Categorías")
@Controller("actividades/categorias")
export class CategoriaActividadController {
  constructor(
    private readonly categoriaActividadService: CategoriaActividadService,
  ) {}

  @Post() // CREAR UNA CATEGORIA
  @ApiOperation({ summary: "Registrar una nueva categoría de actividad" }) // Swagger
  @ApiResponse({
    status: 201,
    description: "La categoría ha sido creada exitosamente.",
  }) // Swagger
  create(@Body() createCategoriaActividadDto: CreateCategoriaActividadDto) {
    return this.categoriaActividadService.create(createCategoriaActividadDto);
  }

  @Get() // OBTENER TODAS LAS CATEGORIAS
  @ApiOperation({ summary: "Listar categorías de actividad" })
  @ApiQuery({
    name: "nombre",
    required: false,
    description: "Filtrar por nombre",
  })
  findAll(@Query("nombre") nombre?: string) {
    return this.categoriaActividadService.findAll(nombre);
  }

  @Get(":id") // OBTENER UNA UNICA CATEGORIA
  @ApiOperation({ summary: "Obtener una categoría de actividad por ID" })
  findOne(@Param("id") id: string) {
    return this.categoriaActividadService.findOne(+id);
  }

  @Patch(":id") // ACTUALIZAR UNA CATEGORIA
  @ApiOperation({ summary: "Actualizar nombre de una categoría de actividad" })
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
  remove(@Param("id") id: string) {
    return this.categoriaActividadService.remove(+id);
  }
}
