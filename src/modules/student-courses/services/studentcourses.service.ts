import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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

  async create(createStudentCoursesDto: CreateStudentCourseDto) {
    try {
      const studentcourses = this.studentCourseRepository.create(
        createStudentCoursesDto,
      );
      await this.studentCourseRepository.save(studentcourses);
      return (
        (await this.studentCourseRepository.findOne({
          where: { studentcoursesId: studentcourses.studentcoursesId },
          relations: {
            estudiante: true,
            courses: true,
          },
        })) ?? undefined
      );
    } catch (error) {
      this.handleDBException(error);
    }
  }
  async findByStudentId(studentId: number) {
    return await this.studentCourseRepository.find({
      where: { estudiante: { id: studentId } },
      relations: ['courses'],
    });
  }

  async findStudentsByCourseId(coursesId: number) {
    const studentCourses = await this.studentCourseRepository.find({
      where: { coursesId },
    });

    const studentIds = studentCourses.map((sc) => sc.studentId);

    if (studentIds.length === 0) {
      return [];
    }

    // Busca los estudiantes cuyos IDs están en el array
    const students = await this.estudianteRepository.findBy({
      id: In(studentIds),
    });

    return students;
  }

  async findOne(id: number) {
    const studentCourse = await this.studentCourseRepository.findOne({
      where: { studentcoursesId: id },
      relations: {
        estudiante: true,
        courses: true,
      },
    });
    if (!studentCourse) {
      throw new NotFoundException(`studentcourses con id ${id} no encontrado`);
    }
    return studentCourse;
  }

  async update(id: number, changes: CreateStudentCourseDto) {
    const studentCourse = await this.studentCourseRepository.findOne({
      where: { studentcoursesId: id },
      relations: {
        estudiante: true,
        courses: true,
      },
    });

    if (!studentCourse) {
      throw new NotFoundException(`Registro con id ${id} no encontrado`);
    }

    try {
      if (changes.studentId) {
        const estudiante = await this.estudianteRepository.findOneBy({
          id: changes.studentId,
        });
        if (!estudiante)
          throw new NotFoundException('Estudiante no encontrado');

        studentCourse.estudiante = estudiante;
      }

      if (changes.coursesId) {
        const curso = await this.coursesRepository.findOneBy({
          id: changes.coursesId,
        });
        if (!curso) throw new NotFoundException('Curso no encontrado');
        studentCourse.courses = curso;
      }

      if (changes.enrollmentDate) {
        studentCourse.enrollmentDate = changes.enrollmentDate;
      }

      const updated = await this.studentCourseRepository.save(studentCourse);

      return {
        message: 'Registro actualizado con éxito',
        data: updated,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async deleteAllStudentcourses() {
    const query =
      this.studentCourseRepository.createQueryBuilder('studentCourse');
    try {
      return await query.delete().where({}).execute();
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

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Ocurrió un error inesperado. Intente más tarde',
    );
  }
}
