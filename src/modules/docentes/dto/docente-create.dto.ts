import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class createDocenteDto {
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
  @ApiProperty()
  @Min(5)
  codigo_laboral: number;

  @ApiProperty()
  @IsString()
  cursos_asignados: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  direccion: string;

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
  telefono: string;

  @IsEmail()
  @ApiProperty()
  @IsOptional()
  email: string;

  @IsBoolean()
  @ApiProperty()
  estado: boolean;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  isAvailable: boolean;
}

export class UpdateDocenteDto extends PartialType(createDocenteDto) {}
