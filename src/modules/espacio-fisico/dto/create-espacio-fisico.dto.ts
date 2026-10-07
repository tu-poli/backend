import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEspacioFisicoDto {
  @ApiProperty({ example: "Cancha", description: "Nombre del espacio físico" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-\.,]+$/, {
    message:
      "El campo contiene caracteres no permitidos. Solo se permiten letras, números, espacios y puntuación básica como guiones o puntos.",
  })
  nombre: string;

  @ApiProperty({
    example: "Cancha de futbol",
    description: "Descripción del espacio físico",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-\.,]+$/, {
    message:
      "La descripción debe comenzar con una letra, puede contener números y solo permite un espacio entre palabras (sin caracteres especiales)",
  })
  descripcion?: string;
}
