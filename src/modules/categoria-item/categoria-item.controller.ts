import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { CategoriaItemService } from "./categoria-item.service";
import { CreateCategoriaItemDto } from "./dto/create-categoria-item.dto";
import { UpdateCategoriaItemDto } from "./dto/update-categoria-item.dto";

@ApiTags("Inventario - Categorías")
@Controller("inventario/categorias")
export class CategoriaItemController {
  constructor(private readonly categoriaItemService: CategoriaItemService) {}

  @Post() // CREAR UNA CATEGORIA
  @ApiOperation({ summary: "Registrar una nueva categoría" }) // Swagger
  @ApiResponse({
    status: 201,
    description: "La categoría ha sido creada exitosamente.",
  }) // Swagger
  create(@Body() createCategoriaItemDto: CreateCategoriaItemDto) {
    return this.categoriaItemService.create(createCategoriaItemDto);
  }

  @Get() // OBTENER TODAS LAS CATEGORIAS
  @ApiOperation({ summary: "Listar categorías" })
  @ApiQuery({
    name: "nombre",
    required: false,
    description: "Filtrar por nombre",
  })
  findAll(@Query("nombre") nombre?: string) {
    return this.categoriaItemService.findAll(nombre);
  }

  @Get(":id") // OBTENER UN UNICA CATEGORIA
  @ApiOperation({ summary: "Obtener una categoría por ID" })
  findOne(@Param("id") id: string) {
    return this.categoriaItemService.findOne(+id);
  }

  @Put(":id") // ACTUALIZAR UNA CATEGORIA
  @ApiOperation({ summary: "Actualizar nombre de una categoría" })
  update(
    @Param("id") id: string,
    @Body() updateCategoriaItemDto: UpdateCategoriaItemDto,
  ) {
    return this.categoriaItemService.update(+id, updateCategoriaItemDto);
  }

  @Delete(":id") // BORRAR UNA CATEGORIA
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Eliminar una categoría" })
  @ApiResponse({ status: 204, description: "La categoría ha sido eliminada." })
  remove(@Param("id") id: string) {
    return this.categoriaItemService.remove(+id);
  }
}
