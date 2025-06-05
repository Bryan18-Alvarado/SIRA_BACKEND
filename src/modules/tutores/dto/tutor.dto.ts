// src/modules/tutores/dto/create-tutor.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  MinLength,
  IsPositive,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateTutorDto {
  @IsOptional()
  @IsNumber()
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

  @IsString()
  @IsOptional()
  @ApiProperty()
  telefono?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly estado_civil_id: number;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  correoElectronico?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  direccion?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly genero_id: number;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  isAvailable: boolean;
}

export class UpdateTutorDto extends PartialType(CreateTutorDto) {}

export class FilterTutorDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset: number;

  @IsOptional()
  nombre: string;
}
