import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCategoriesDto {
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
  descripcion: string;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  status: boolean;
}
export class UpdateCategoriesDto extends PartialType(CreateCategoriesDto) {}
