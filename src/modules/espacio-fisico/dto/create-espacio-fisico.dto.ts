import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEspacioFisicoDto {
  @ApiProperty({ example: 'Cancha', description: 'Nombre del espacio físico' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { 
    message: 'El nombre solo puede contener letras y espacios (sin números ni caracteres especiales)' 
  })
  nombre: string;

  @ApiProperty({ example: 'Cancha de futbol', description: 'Descripción del espacio físico', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { 
    message: 'La descripción solo puede contener letras y espacios (sin números ni caracteres especiales)' 
  })
  descripcion?: string;
}
