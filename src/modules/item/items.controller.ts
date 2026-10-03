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
import { ItemsService } from "./items.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";

@ApiTags("Items")
@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: "Registrar un nuevo ítem en inventario" })
  @ApiResponse({ status: 201, description: "Ítem creado exitosamente." })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar items con categoría anidada" })
  @ApiQuery({
    name: "elemento",
    required: false,
    description: "Filtrar por nombre del elemento",
  })
  @ApiQuery({
    name: "categoriaId",
    required: false,
    type: Number,
    description: "Filtrar por ID de la categoría",
  })
  findAll(
    @Query("elemento") elemento?: string,
    @Query("categoriaId") categoriaId?: string,
  ) {
    return this.itemsService.findAll(
      elemento,
      categoriaId ? +categoriaId : undefined,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un ítem por ID" })
  findOne(@Param("id") id: string) {
    return this.itemsService.findOne(+id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar datos o cantidad de un ítem" })
  update(@Param("id") id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Eliminar un ítem de inventario" })
  remove(@Param("id") id: string) {
    return this.itemsService.remove(+id);
  }
}
