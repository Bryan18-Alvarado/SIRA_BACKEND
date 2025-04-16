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
  @IsOptional()
  description: string;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  status: boolean;

  // //sirve para saber cuando fue creada la categoria
  // @Transform(({ value }) => new Date(value))
  // @IsDate()
  // @ApiProperty()
  // created_at: Timestamp;

  // @Transform(({ value }) => new Date(value))
  // @IsDate()
  // @ApiProperty()
  // //sirve para saber cuando fue modificada
  // updated_at: Timestamp;
}
export class UpdateCategoriesDto extends PartialType(CreateCategoriesDto) {}
