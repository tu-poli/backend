import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString, Matches } from "class-validator";

export class QueryCategoriaActividadDto {
  @ApiPropertyOptional({
    example: "Deportes",
    description:
      "Filtrar por nombre de categoría (solo letras, sin espacios en el medio, números ni caracteres especiales)",
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" && value.trim() !== "" ? value.trim() : undefined,
  )
  @IsString({
    message: "El parámetro de búsqueda nombre debe ser una cadena de texto",
  })
  @Matches(/^\S+$/, {
    message:
      "El parámetro de búsqueda nombre no debe tener espacios en el medio",
  })
  @Matches(/^[^0-9]+$/, {
    message: "El parámetro de búsqueda nombre no debe contener números",
  })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/, {
    message:
      "El parámetro de búsqueda nombre solo debe contener letras, sin caracteres especiales",
  })
  nombre?: string;
}
