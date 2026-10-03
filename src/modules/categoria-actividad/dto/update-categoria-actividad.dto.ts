import { PartialType } from "@nestjs/swagger";
import { CreateCategoriaActividadDto } from "./create-categoria-actividad.dto";

export class UpdateCategoriaActividadDto extends PartialType(
  CreateCategoriaActividadDto,
) {}
