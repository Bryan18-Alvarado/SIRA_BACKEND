import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCalificacionDto {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  grades_id?: number;

  @IsInt()
  @ApiProperty()
  student_courses_id: number;

  @IsNumber()
  @ApiProperty()
  grade_value: number;

  @IsDate()
  @ApiProperty()
  grade_date: Date;

  @IsString()
  @ApiProperty()
  grade_type: string;
}
export class UpdateCalificacionDto extends PartialType(CreateCalificacionDto) {}
