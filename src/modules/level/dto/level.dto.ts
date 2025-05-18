import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateLevelDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsString()
  @ApiProperty()
  @MinLength(3)
  level_course: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isActive?: boolean;
}

export class UpdateLevelDto extends PartialType(CreateLevelDto) {}
