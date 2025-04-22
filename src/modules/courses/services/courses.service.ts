import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from '../entities/courses.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateCoursesDto, UpdateCoursesDto } from '../dto/courses.dto';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger('CoursesService');
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
  ) {}

  findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;
    return this.coursesRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async create(createCoursesDto: CreateCoursesDto) {
    try {
      const courses = this.coursesRepository.create(createCoursesDto);
      await this.coursesRepository.save(courses);

      return courses;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, updateCoursesDto: UpdateCoursesDto) {
    const courses = await this.coursesRepository.findOne({
      where: { id },
    });
    if (!courses) {
      throw new NotFoundException(`curso con id ${id} no encontrado`);
    }
    try {
      this.coursesRepository.merge(courses, updateCoursesDto);
      await this.coursesRepository.save(courses);
      return {
        message: 'registro actualizado con exito',
        data: courses,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }
  // revisar este metodo con el profesor
  // async remove(id: number) {
  //   const exists = await this.coursesRepository.existsBy({ id });
  //   if (!exists) {
  //     throw new NotFoundException(`curso con id ${id} no encontrado`);
  //   }
  //   try {
  //     await this.coursesRepository.softDelete(id);
  //     return {
  //       message: 'registro eliminado con exito',
  //       deleteAt: new Date(),
  //     };
  //   } catch (error) {
  //     this.handleDBException(error);
  //   }
  // }

  async remove(id: number) {
    const exists = await this.coursesRepository.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(`docente con id ${id} no encontrado`);
    }
    await this.coursesRepository.softDelete({ id });
    return {
      message: `courses con id ${id} eliminado con exito`,
      deleteAt: new Date(),
    };
  }

  async findOne(id: number) {
    const courses = await this.coursesRepository.findOneBy({ id });
    if (!courses) {
      throw new NotFoundException(`curso con id ${id} no fue encontrado`);
    }
    return courses;
  }
  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
  }
}
