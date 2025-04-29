import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCalificacionDto {
  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'ID opcional de la calificación (autogenerado)' })
  gradesId?: number;

  @IsInt()
  @ApiProperty({ description: 'ID del estudiante relacionado' })
  studentId: number;

  @IsInt()
  @ApiProperty({ description: 'ID del curso relacionado' })
  courseId: number;

  @IsNumber()
  @ApiProperty({ description: 'Nota o puntaje de la calificación' })
  grade: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'Fecha en que se asignó la calificación',
    type: String,
    format: 'date',
  })
  gradeDate: Date;

  @IsString()
  @ApiProperty({
    description: 'Tipo de calificación (por ejemplo: examen, tarea)',
  })
  gradeType: string;
}

export class UpdateCalificacionDto extends PartialType(CreateCalificacionDto) {}
