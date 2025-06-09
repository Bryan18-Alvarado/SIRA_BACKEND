import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from '../entities/courses.entity';
import { ILike, Repository } from 'typeorm';
import {
  CreateCoursesDto,
  FilterCoursesDto,
  UpdateCoursesDto,
} from '../dto/courses.dto';
import { Categories } from 'src/modules/categories/entities/categories.entity';
import { Level } from 'src/modules/level/entities/level.entity';
import { Docente } from 'src/modules/docentes/entities/docentes.entity';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger('CoursesService');

  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,

    @InjectRepository(Categories)
    private readonly categoryRepository: Repository<Categories>,

    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,

    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
  ) {}

  async findAll(params: FilterCoursesDto) {
    const { limit = 5, offset = 0, descripcion } = params;
    const where = descripcion ? { descripcion: ILike(`%${descripcion}%`) } : {};

    const [data, total] = await this.coursesRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      relations: ['categories', 'level', 'docentes'],
      order: { id: 'ASC' },
    });

    return {
      data,
      total,
    };
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
      where: { id },
      relations: {
        categories: true,
        level: true,
        docentes: true,
      },
    });

    if (!courses) {
      throw new NotFoundException(
        `Curso con id ${id} no fue encontrado en la base de datos`,
      );
    }
    return courses;
  }

  async update(id: number, changes: UpdateCoursesDto) {
    const courses = await this.coursesRepository.findOne({
      where: { id },
      relations: {
        categories: true,
        level: true,
        docentes: true,
      },
    });

    if (!courses) {
      throw new NotFoundException(`Curso con id ${id} no encontrado`);
    }

    // Validar categoría
    if (changes.categories_id) {
      const category = await this.categoryRepository.findOneBy({
        id: changes.categories_id,
      });
      if (!category) {
        throw new NotFoundException(
          `La categoría con id ${changes.categories_id} no fue encontrada`,
        );
      }
      courses.categories = category;
    }

    // Validar nivel
    if (changes.level_id) {
      const level = await this.levelRepository.findOneBy({
        id: changes.level_id,
      });

      if (!level) {
        throw new NotFoundException(
          `El nivel con id ${changes.level_id} no fue encontrado`,
        );
      }
      courses.level = level;
    }

    // Validar docente
    if (changes.docentes_id) {
      const docente = await this.docenteRepository.findOneBy({
        id: changes.docentes_id,
      });
      if (!docente) {
        throw new NotFoundException(
          `El docente con id ${changes.docentes_id} no fue encontrado`,
        );
      }
      courses.docentes = docente;
    }

    this.coursesRepository.merge(courses, changes);
    const updated = await this.coursesRepository.save(courses);

    return {
      message: 'Curso actualizado correctamente',
      data: updated,
    };
  }

  async remove(id: number) {
    const exists = await this.coursesRepository.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(`Curso con id ${id} no encontrado`);
    }
    await this.coursesRepository.softDelete({ id });
    return {
      message: `Curso con id ${id} eliminado con éxito`,
      deleteAt: new Date(),
    };
  }

  async deleteAllCourses() {
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
