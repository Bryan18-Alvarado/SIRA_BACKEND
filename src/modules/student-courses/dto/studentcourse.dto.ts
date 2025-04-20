import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsNumber } from 'class-validator';

export class CreateStudentCourseDto {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  studentcourseId?: number;

  @IsInt()
  @ApiProperty()
  studentId: number;

  @IsInt()
  @ApiProperty()
  coursesId: number;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty()
  enrollmentDate: Date;

  @IsNumber()
  @ApiProperty()
  grade: number;
}

export class UpdateStudentCourseDto extends PartialType(
  CreateStudentCourseDto,
) {}
