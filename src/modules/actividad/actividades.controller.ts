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
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { ActividadesService } from "./actividades.service";
import { CreateActividadDto } from "./dto/create-actividad.dto";
import { UpdateActividadDto } from "./dto/update-actividad.dto";

@ApiTags("Actividades")
@Controller("actividades")
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Post()
  @ApiOperation({ summary: "Registrar una nueva actividad" })
  @ApiResponse({
    status: 201,
    description: "La actividad ha sido registrada exitosamente.",
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos o faltantes.",
  })
  @ApiResponse({
    status: 404,
    description: "La categoría especificada no existe.",
  })
  create(@Body() createActividadDto: CreateActividadDto) {
    return this.actividadesService.create(createActividadDto);
  }

  @Get()
  @ApiOperation({
    summary: "Listar actividades con su categoría asociada",
  })
  @ApiQuery({
    name: "nombre",
    required: false,
    description: "Filtrar por nombre de la actividad",
  })
  @ApiQuery({
    name: "categoriaId",
    required: false,
    type: Number,
    description: "Filtrar por ID de la categoría",
  })
  @ApiQuery({
    name: "requiereAutorizacion",
    required: false,
    type: Boolean,
    description: "Filtrar por si requiere autorización (true/false)",
  })
  findAll(
    @Query("nombre") nombre?: string,
    @Query("categoriaId") categoriaId?: string,
    @Query("requiereAutorizacion") requiereAutorizacion?: string,
  ) {
    const parseadoRequiereAutorizacion =
      requiereAutorizacion !== undefined
        ? requiereAutorizacion === "true" || requiereAutorizacion === "1"
        : undefined;

    return this.actividadesService.findAll(
      nombre,
      categoriaId ? +categoriaId : undefined,
      parseadoRequiereAutorizacion,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener una actividad por ID" })
  @ApiParam({
    name: "id",
    description: "Identificador numérico de la actividad",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Actividad encontrada.",
  })
  @ApiResponse({
    status: 404,
    description: "Actividad no encontrada.",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.actividadesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar parcialmente una actividad (PATCH)" })
  @ApiParam({
    name: "id",
    description: "Identificador numérico de la actividad",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Actividad actualizada parcialmente exitosamente.",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateActividadDto: UpdateActividadDto,
  ) {
    return this.actividadesService.update(id, updateActividadDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Eliminar una actividad" })
  @ApiParam({
    name: "id",
    description: "Identificador numérico de la actividad a eliminar",
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: "Actividad eliminada exitosamente.",
  })
  @ApiResponse({
    status: 400,
    description:
      "No se puede eliminar la actividad si posee reservas asociadas.",
  })
  @ApiResponse({
    status: 404,
    description: "Actividad no encontrada.",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.actividadesService.remove(id);
  }
}
