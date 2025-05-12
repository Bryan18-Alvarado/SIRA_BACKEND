import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateGendersDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  code?: string; //sirve para usar abreviaciones de los generos (M,F)

  @IsBoolean()
  @ApiProperty()
  isActive: boolean; //si el genero esta activo o no
}

export class UpdateGendersDto extends PartialType(CreateGendersDto) {}
