import { PartialType } from "@nestjs/swagger";
import { CreateEspacioFisicoDto } from "./create-espacio-fisico.dto";

export class UpdateEspacioFisicoDto extends PartialType(
  CreateEspacioFisicoDto,
) {}
