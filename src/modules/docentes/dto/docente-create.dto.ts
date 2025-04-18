import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  // IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { EstadoCivil, Genero } from '../entities/docentes.entity';

export class CreateDocenteDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsString()
  @ApiProperty()
  @MinLength(3)
  nombre: string;

  @IsString()
  @ApiProperty()
  @MinLength(3)
  apellido: string;

  @IsNumber()
  @ApiProperty()
  edad: number;

  @IsEnum(Genero)
  @ApiProperty({
    enum: Genero,
    description: 'Genero del docente (masculino o femenino)',
  })
  genero: Genero;

  @IsNumber()
  @ApiProperty()
  @Min(5)
  codigo_laboral: number;

  @ApiProperty()
  @IsString()
  cursos_asignados: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  direccion?: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty()
  fecha_ingreso: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty()
  fecha_nacimiento: Date;

  @IsString()
  @ApiProperty()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @ApiProperty()
  @IsOptional()
  email?: string;

  @IsEnum(EstadoCivil)
  @ApiProperty({
    enum: EstadoCivil,
    description: 'Estado civil del docente (casado o soltero)',
  })
  estado_civil: EstadoCivil;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  isAvailable: boolean;
}

export class UpdateDocenteDto extends PartialType(CreateDocenteDto) {}
