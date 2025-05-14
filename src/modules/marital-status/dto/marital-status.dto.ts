import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMaritalStatusDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsString()
  @ApiProperty()
  @MinLength(3)
  marital_status: string;
}

export class UpdateMaritalStatusDto extends PartialType(
  CreateMaritalStatusDto,
) {}
