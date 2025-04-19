import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsNumber } from 'class-validator';

export class CreateStudentCourseDto {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  student_courses_id?: number;

  @IsInt()
  @ApiProperty()
  student_id: number;

  @IsInt()
  @ApiProperty()
  id_courses: number;

  @IsDate()
  @ApiProperty()
  enrollment_date: Date;

  @IsNumber()
  @ApiProperty()
  grade: number;
}

export class UpdateStudentCourseDto extends PartialType(
  CreateStudentCourseDto,
) {}
