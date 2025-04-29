import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { CreateCalificacionDto } from 'src/modules/calificaciones/dto/calificacion.dto/calificacion.dto';

export class CreateStudentCourseDto {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  studentcoursesId?: number;

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
}

export class UpdateStudentCourseDto extends PartialType(
  CreateStudentCourseDto,
) {}
