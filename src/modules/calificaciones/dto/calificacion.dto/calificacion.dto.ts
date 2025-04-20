import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCalificacionDto {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  gradesId?: number;

  @IsInt()
  @ApiProperty()
  studentcoursesId: number;

  @IsNumber()
  @ApiProperty()
  grade: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty()
  gradeDate: Date;

  @IsString()
  @ApiProperty()
  gradeType: string;
}
export class UpdateCalificacionDto extends PartialType(CreateCalificacionDto) {}
