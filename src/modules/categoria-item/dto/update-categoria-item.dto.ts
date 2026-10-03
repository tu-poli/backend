import { PartialType } from "@nestjs/swagger";
import { CreateCategoriaItemDto } from "./create-categoria-item.dto";

export class UpdateCategoriaItemDto extends PartialType(
  CreateCategoriaItemDto,
) {}
