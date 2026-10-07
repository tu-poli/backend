import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateCategoriaActividadDto {
  // Swagger
  @ApiProperty({
    example: "Deportes",
    description:
      "Nombre de la categoría (únicamente letras, sin espacios en el medio, números ni caracteres especiales)",
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

  // Atributos
  nombre: string;
}
