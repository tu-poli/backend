import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriaItemDto {
  // Swagger
  @ApiProperty({ example: 'Deportes', description: 'Nombre de la categoría' })

  // Class Validator
  @IsString()
  @IsNotEmpty()

  // Atributos 
  nombre: string;
}
