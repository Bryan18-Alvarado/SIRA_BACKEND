import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  IsEmail,
} from 'class-validator';
import { StudentCourse } from 'src/modules/student-courses/entities/studentcourse.entity';
import { Calificacion } from 'src/modules/calificaciones/entities/calificacion.entity';

export class CreateEstudianteDto {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  id?: number;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  nombre: string;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  apellido: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty()
  fechaNacimiento: Date;

  @IsString()
  @IsOptional()
  @ApiProperty()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  correoElectronico?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  direccion?: string;
}

export class UpdateEstudianteDto extends PartialType(CreateEstudianteDto) {}
