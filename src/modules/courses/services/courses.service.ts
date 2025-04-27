import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from '../entities/courses.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import {
  CreateCoursesDto,
  FilterCoursesDto,
  UpdateCoursesDto,
} from '../dto/courses.dto';
import { Categories } from 'src/modules/categories/entities/categories.entity';
import { Docente } from 'src/modules/docentes/entities/docentes.entity';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger('CoursesService');
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,

    @InjectRepository(Categories)
    private readonly brandRepository: Repository<Categories>,

    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
  ) {}

  findAll(params?: FilterCoursesDto) {
    const { limit, offset, description } = params || {};
    const where: FindOptionsWhere<Courses> = {};

    if (description) {
      where.descripcion = ILike(`%${description}%`);
    }

    return this.coursesRepository.find({
      order: { id: 'ASC' },
      where,
      take: limit,
      skip: offset,
      relations: {
        categories: true,
        docentes: true,
      },
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

  async findOne(id: number) {
    const courses = await this.coursesRepository.findOne({
      where: { id: id },
      relations: {
        categories: true,
        docentes: true,
      },
    });

    if (!courses) {
      throw new NotFoundException(
        `curso con id ${id} no fue encontrado en la base de datos`,
      );
    }
    return courses;
  }

  async update(id: number, changes: UpdateCoursesDto) {
    const courses = await this.coursesRepository.findOne({
      where: { id },
      relations: { categories: true, docentes: true },
    });

    if (!courses) {
      throw new NotFoundException(`curso con id ${id} no encontrado`);
    }

    if (changes.categories_id) {
      const category = await this.brandRepository.findOneBy({
        id: changes.categories_id,
      });
      if (!category) {
        throw new NotFoundException(
          `la categoria con id ${changes.categories_id} no fue encontrada`,
        );
      }
      courses.categories = category;
    }

    if (changes.docentes_id) {
      const docente = await this.docenteRepository.findOneBy({
        id: changes.docentes_id,
      });
      if (!docente) {
        throw new NotFoundException(
          `el docente con id ${changes.docentes_id} no fue encontrado`,
        );
      }
      courses.docentes = docente;
    }

    this.coursesRepository.merge(courses, changes);
    const updated = await this.coursesRepository.save(courses);

    return {
      message: 'curso actualizado correctamente',
      data: updated,
    };
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

  async deleteAllCars() {
    const query = this.coursesRepository.createQueryBuilder('courses');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    );
  }
}
