import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  IsEmail,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

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

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  readonly genero_id: number;

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
