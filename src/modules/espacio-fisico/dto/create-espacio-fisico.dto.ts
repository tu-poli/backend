import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEspacioFisicoDto {
  @ApiProperty({ example: 'Cancha', description: 'Nombre del espacio físico' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ][a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]*(?: [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]+)*$/, { 
    message: 'El nombre debe comenzar con una letra, puede contener números y solo permite un espacio entre palabras (sin caracteres especiales)' 
  })
  nombre: string;

  @ApiProperty({ example: 'Cancha de futbol', description: 'Descripción del espacio físico', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ][a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]*(?: [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9]+)*$/, { 
    message: 'La descripción debe comenzar con una letra, puede contener números y solo permite un espacio entre palabras (sin caracteres especiales)' 
  })
  descripcion?: string;
}
