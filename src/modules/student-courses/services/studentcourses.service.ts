import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCourse } from '../entities/studentcourse.entity';
import { CreateStudentCourseDto } from '../dto/studentcourse.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Estudiante } from 'src/modules/estudiantes/entities/estudiante.entity';
import { Courses } from 'src/modules/courses/entities/courses.entity';

@Injectable()
export class StudentCoursesService {
  private readonly logger = new Logger('StudentCoursesService');

  constructor(
    @InjectRepository(StudentCourse)
    private readonly studentCourseRepository: Repository<StudentCourse>,

    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,

    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;
    return this.studentCourseRepository.find({
      take: limit,
      skip: offset,
      relations: ['estudiante', 'courses'],
    });
  }

  async create(createStudentCourseDto: CreateStudentCourseDto) {
    const { studentId, coursesId, enrollmentDate } = createStudentCourseDto;

    try {
      const estudiante = await this.estudianteRepository.findOne({
        where: { id: studentId },
      });
      if (!estudiante) {
        throw new NotFoundException(
          `Estudiante con ID ${studentId} no encontrado`,
        );
      }

      const curso = await this.coursesRepository.findOne({
        where: { id: coursesId },
      });
      if (!curso) {
        throw new NotFoundException(`Curso con ID ${coursesId} no encontrado`);
      }

      const studentCourse = this.studentCourseRepository.create({
        estudiante,
        courses: curso,
        enrollmentDate,
      });

      const saved = await this.studentCourseRepository.save(studentCourse);

      return {
        message: 'Estudiante inscrito correctamente',
        data: saved,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, updateDto: Partial<CreateStudentCourseDto>) {
    const studentCourse = await this.studentCourseRepository.findOne({
      where: { studentcoursesId: id },
    });

    if (!studentCourse) {
      throw new NotFoundException(`Registro con id ${id} no encontrado`);
    }
    try {
      this.studentCourseRepository.merge(studentCourse, updateDto);
      await this.studentCourseRepository.save(studentCourse);
      return {
        message: 'Registro actualizado con éxito',
        data: studentCourse,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exists = await this.studentCourseRepository.existsBy({
      studentcoursesId: id,
    });
    if (!exists) {
      throw new NotFoundException(`Registro con id ${id} no encontrado`);
    }
    await this.studentCourseRepository.softDelete({ studentcoursesId: id });
    return {
      message: `Registro con ID ${id} eliminado con éxito`,
      deletedAt: new Date(),
    };
  }

  async findOne(id: number) {
    const studentCourse = await this.studentCourseRepository.findOne({
      where: { studentcoursesId: id },
      relations: ['estudiante', 'courses', 'grade'], // 👈 relaciones relacionadas
    });
    if (!studentCourse) {
      throw new NotFoundException(`Registro con id ${id} no encontrado`);
    }
    return studentCourse;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Ocurrió un error inesperado. Intente más tarde',
    );
  }
}
