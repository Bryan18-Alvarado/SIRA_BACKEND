import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
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
  @ApiProperty()
  @IsNotEmpty()
  readonly genero_id: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  readonly estado_civil_id: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ApiProperty({ type: [Number], required: false })
  cursos_ids?: number[];

  @IsNumber()
  @ApiProperty()
  @Min(5)
  codigo_laboral: number;

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

export class UpdateDocenteDto extends PartialType(CreateDocenteDto) {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ApiProperty({ type: [Number], required: false })
  cursos_ids?: number[];
}

export class FilterDocenteDto {
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
