import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateCategoriaItemDto {
  // Swagger
  @ApiProperty({
    example: "Deportes",
    description:
      "Nombre de la categoría (sin símbolos, únicamente letras o números)",
  })
  // Class Validator & Transformer
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString({ message: "El campo nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El campo nombre no puede estar vacío" })
  @MinLength(2, { message: "El campo nombre debe tener al menos 2 caracteres" })
  @MaxLength(255, {
    message: "El campo nombre no puede exceder los 255 caracteres",
  })
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-\.,]+$/, {
    message:
      "El campo contiene caracteres no permitidos. Solo se permiten letras, números, espacios y puntuación básica como guiones o puntos.",
  })
  nombre: string;

  @ApiPropertyOptional({
    example: "#10B981",
    description:
      "Color de la categoría en formato hexadecimal (ej. #10B981 o #FFF)",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsOptional()
  @IsString({ message: "El campo color debe ser una cadena de texto" })
  @MaxLength(50, {
    message: "El campo color no puede exceder los 50 caracteres",
  })
  @Matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
    message:
      "El formato de color debe ser un código hexadecimal válido (ej. #10B981 o #FFF)",
  })
  color?: string;

  @ApiPropertyOptional({
    example: "trophy",
    description: "Nombre o identificador del ícono de la categoría",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsOptional()
  @IsString({ message: "El campo icono debe ser una cadena de texto" })
  @MaxLength(50, {
    message: "El campo icono no puede exceder los 50 caracteres",
  })
  @Matches(/^[a-zA-Z0-9\-_]+$/, {
    message:
      "El campo icono solo puede contener letras, números, guiones y guiones bajos",
  })
  icono?: string;
}

export class CrearCategoriaItemDto extends CreateCategoriaItemDto {}
