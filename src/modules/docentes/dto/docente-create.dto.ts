import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

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

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  readonly genero?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  readonly estado_civil?: string;

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

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  isAvailable: boolean;
}

export class UpdateDocenteDto extends PartialType(CreateDocenteDto) {}
