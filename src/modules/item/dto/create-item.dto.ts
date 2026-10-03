import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateItemDto {
  @ApiProperty({ example: "Pelota de Básquet", description: "Nombre del ítem" })
  @IsNotEmpty()
  @IsString()
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
