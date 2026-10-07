import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateActividadDto {
  @ApiProperty({
    example: "Taller de Fútbol Infantil",
    description: "Nombre de la actividad (sin símbolos extraños ni espacios múltiples)",
  })
  // Elimina espacios múltiples (ej. "Taller   de    Fútbol" -> "Taller de Fútbol") y hace trim.
  @Transform(({ value }) =>
    typeof value === "string" ? value.replace(/\s+/g, " ").trim() : value,
  )
  @IsNotEmpty({ message: "El campo nombre no puede estar vacío" })
  @IsString({ message: "El campo nombre debe ser una cadena de texto" })
  @MinLength(3, { message: "El campo nombre debe tener al menos 3 caracteres" })
  @MaxLength(100, {
    message: "El campo nombre no puede exceder los 100 caracteres",
  })
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-\.,]+$/, {
    message:
      "El campo nombre contiene símbolos no permitidos. Use solo letras, números, espacios o puntuación básica.",
  })
  nombre: string;

  @ApiPropertyOptional({
    example: "Actividad deportiva y formativa para niños de 6 a 12 años",
    description: "Descripción detallada de la actividad",
  })
  @IsOptional()
  @IsString({ message: "El campo descripción debe ser una cadena de texto" })
  @MaxLength(255, {
    message: "El campo descripción no puede exceder los 255 caracteres",
  })
  descripcion?: string;

  @ApiProperty({
    example: 1,
    description: "ID de la categoría de actividad asociada",
  })
  @IsNotEmpty({ message: "La categoría (categoriaId) es obligatoria" })
  @IsNumber({}, { message: "categoriaId debe ser un número entero" })
  categoriaId: number;

  @ApiPropertyOptional({
    example: false,
    description:
      "Indica si la actividad requiere autorización médica o especial (ej. excursiones)",
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: "requiereAutorizacion debe ser un valor booleano" })
  requiereAutorizacion?: boolean;
}

// Alias en español para convención estricta
export class CrearActividadDto extends CreateActividadDto {}
