import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateInventarioDto {
  // Swagger
  @ApiProperty({
    example: 'Principal',
    description: 'Nombre del inventario (sin símbolos, únicamente letras o números)',
  })

  // Class Validator & Transformer
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El campo nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo nombre no puede estar vacío' })
  @MinLength(2, { message: 'El campo nombre debe tener al menos 2 caracteres' })
  @MaxLength(255, { message: 'El campo nombre no puede exceder los 255 caracteres' })
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/, {
    message: 'El campo nombre no debe contener símbolos, únicamente letras o números',
  })
  nombre: string;

  @ApiPropertyOptional({
    example: 'Inventario principal del polideportivo',
    description: 'Descripción detallada del inventario',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString({ message: 'El campo descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El campo descripción no puede exceder los 255 caracteres' })
  descripcion?: string;
}
