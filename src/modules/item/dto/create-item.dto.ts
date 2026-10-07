import { IsNotEmpty, IsNumber, IsString, Min, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'Pelota de Básquet', description: 'Nombre del ítem' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ][a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]*(?: [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]+)*$/, { 
    message: 'El nombre debe comenzar con una letra, puede contener números y solo permite un espacio entre palabras (sin caracteres especiales)' 
  })
  elemento: string;

  @ApiProperty({ example: 1, description: 'ID de la categoría' })
  @IsNotEmpty()
  @IsNumber()
  categoriaId: number;

  @ApiProperty({ example: 10, description: 'Cantidad disponible en inventario', minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cantidad: number;
}
