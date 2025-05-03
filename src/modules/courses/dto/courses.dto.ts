import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsInt,
  MinLength,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateCoursesDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsString()
  @MinLength(3, { message: 'El código debe tener al menos 3 caracteres' })
  @ApiProperty()
  codigo: string; //codigo para identificar el curso

  @IsString()
  @MinLength(3)
  @ApiProperty({
    example: 'Curso de inglés básico',
    description: 'Nombre del curso',
  })
  nombre: string;

  @IsString()
  @ApiProperty({
    example: 'Este curso introduce los fundamentos del idioma ingles A2',
    description: 'Descripción del curso',
  })
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres',
  })
  descripcion: string;

  // @IsNumber()
  // @ApiProperty()
  // id_docente: number;

  @IsString()
  @ApiProperty({ description: 'Duración en meses o número de sesiones' })
  duracion: string;

  @IsString()
  @ApiProperty({
    example: 'Ej: Lunes y miércoles, 5pm - 7pm',
    description: 'Horario del curso',
  })
  horario: string;

  @IsDateString()
  @ApiProperty()
  fecha_inicio: string;

  @IsDateString()
  @ApiProperty()
  fecha_fin: string;

  @IsInt()
  @ApiProperty()
  cupos_disponibles: number;

  @IsBoolean()
  @ApiProperty({ default: true })
  status: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  readonly categories_id: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  readonly nivel_id: number;

  // @IsString()
  // @ApiProperty({ enum: Nivel })
  // nivel: Nivel;

  @IsString()
  @ApiProperty()
  requisitos: string;

  @IsNumber()
  @Min(3)
  @ApiProperty()
  precio: number;
}

export class UpdateCoursesDto extends PartialType(CreateCoursesDto) {}

export class FilterCoursesDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;

  @IsOptional()
  description: string;
}
