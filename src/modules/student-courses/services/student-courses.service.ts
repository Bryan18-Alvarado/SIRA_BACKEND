import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCourse } from '../entities/student-course.entity';
import { CreateStudentCourseDto } from '../dto/create-student-course.dto';

@Injectable()
export class StudentCoursesService {
  constructor(
    @InjectRepository(StudentCourse)
    private readonly studentCourseRepository: Repository<StudentCourse>,
  ) {}

  async create(createStudentCourseDto: CreateStudentCourseDto) {
    try {
      const studentCourse = this.studentCourseRepository.create(
        createStudentCourseDto,
      );
      await this.studentCourseRepository.save(studentCourse);

      return studentCourse;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al crear el registro de curso del estudiante',
      );
    }
  }
}
