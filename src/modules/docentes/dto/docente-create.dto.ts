import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @Type(() => Number)
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

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  edad: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'URL de la imagen del docente',
    required: false,
    example: '/uploads/docentes/archivo.jpg',
  })
  image?: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  genero_id: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  estado_civil_id: number;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @ApiProperty({ type: [Number], required: false })
  cursos_ids?: number[];

  @Type(() => Number)
  @IsNumber()
  @Min(5)
  @ApiProperty()
  codigo_laboral: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  direccion?: string;

  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  fecha_ingreso: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  fecha_nacimiento: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty()
  isAvailable: boolean;
}

export class UpdateDocenteDto extends PartialType(CreateDocenteDto) {
  @IsOptional()
  @IsArray()
  @Type(() => Number)
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
