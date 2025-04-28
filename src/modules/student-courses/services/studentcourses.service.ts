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

@Injectable()
export class StudentCoursesService {
  private readonly logger = new Logger('StudentCoursesService');

  constructor(
    @InjectRepository(StudentCourse)
    private readonly studentCourseRepository: Repository<StudentCourse>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;
    return this.studentCourseRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async create(createStudentCourseDto: CreateStudentCourseDto) {
    try {
      const studentCourse = this.studentCourseRepository.create(
        createStudentCourseDto,
      );
      await this.studentCourseRepository.save(studentCourse);
      return studentCourse;
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
    const studentCourse = await this.studentCourseRepository.findOneBy({
      studentcoursesId: id,
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
