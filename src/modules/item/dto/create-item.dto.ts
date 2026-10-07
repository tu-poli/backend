import { IsNotEmpty, IsNumber, IsString, Min, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateItemDto {
  @ApiProperty({ example: "Pelota de Básquet", description: "Nombre del ítem" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-\.,]+$/, {
    message:
      "El campo contiene caracteres no permitidos. Solo se permiten letras, números, espacios y puntuación básica como guiones o puntos.",
  })
  elemento: string;

  @ApiProperty({ example: 1, description: "ID de la categoría" })
  @IsNotEmpty()
  @IsNumber()
  categoriaId: number;

  @ApiProperty({
    example: 10,
    description: "Cantidad disponible en inventario",
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cantidad: number;
}
