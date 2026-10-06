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
  @Matches(/^\S+$/, {
    message: "El campo nombre no debe tener espacios en el medio",
  })
  @Matches(/^[^0-9]+$/, {
    message: "El campo nombre no debe contener números",
  })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/, {
    message:
      "El campo nombre solo debe contener letras, sin caracteres especiales",
  })

  // Atributos
  nombre: string;
}
