import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateItemDto {
  @ApiProperty({ example: "Pelota de Básquet", description: "Nombre del ítem" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsNotEmpty({ message: "El campo elemento no puede estar vacío" })
  @IsString({ message: "El campo elemento debe ser una cadena de texto" })
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-\.,]+$/, {
    message:
      "El campo elemento contiene caracteres no permitidos. Solo se permiten letras, números, espacios y puntuación básica como guiones o puntos.",
  })
  elemento: string;

  @ApiProperty({ example: 1, description: "ID de la categoría" })
  @IsNotEmpty({ message: "El campo categoriaId no puede estar vacío" })
  @IsNumber({}, { message: "El campo categoriaId debe ser un número" })
  categoriaId: number;

  @ApiProperty({
    example: 10,
    description: "Cantidad disponible en inventario",
    minimum: 0,
  })
  @IsNotEmpty({ message: "El campo cantidad no puede estar vacío" })
  @IsNumber({}, { message: "El campo cantidad debe ser un número" })
  @Min(0, { message: "La cantidad no puede ser negativa" })
  cantidad: number;

  @ApiPropertyOptional({
    example: "LOTE-2024/09#A",
    description: "Identificador o número de lote del ítem",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsOptional()
  @IsString({ message: "El campo lote debe ser una cadena de texto" })
  @MaxLength(100, {
    message: "El campo lote no puede exceder los 100 caracteres",
  })
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-_/#.:\\]+$/, {
    message:
      "El campo lote contiene caracteres no permitidos. Se permiten letras, números, espacios y símbolos de loteo como guiones (-), guiones bajos (_), barras (/ o \\), numeral (#), dos puntos (:) y puntos (.)",
  })
  lote?: string;

  @ApiPropertyOptional({
    example: 5,
    description:
      "Stock mínimo requerido para el ítem (opcional, por defecto 0)",
    minimum: 0,
    default: 0,
  })
  @Transform(({ value, obj }) => {
    const val = value !== undefined ? value : obj?.stock_minimo;
    return val === null ? 0 : val;
  })
  @IsOptional()
  @IsNumber({}, { message: "El campo stockMinimo debe ser un número" })
  @Min(0, { message: "El campo stockMinimo no puede ser menor a 0" })
  stockMinimo?: number;
}

export class CrearItemDto extends CreateItemDto {}
