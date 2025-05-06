import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from '../entities/calificacion.entity';
import {
  CreateCalificacionDto,
  UpdateCalificacionDto,
} from '../dto/calificacion.dto/calificacion.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Estudiante } from 'src/modules/estudiantes/entities/estudiante.entity';
import { Courses } from 'src/modules/courses/entities/courses.entity';

@Injectable()
export class CalificacionesService {
  private readonly logger = new Logger('CalificacionesService');

  constructor(
    @InjectRepository(Calificacion)
    private readonly calificacionRepository: Repository<Calificacion>,

    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,

    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;
    return this.calificacionRepository.find({
      take: limit,
      skip: offset,
      relations: ['estudiante', 'course'],
    });
  }

  async findOne(id: number) {
    const calificacion = await this.calificacionRepository.findOne({
      where: { gradesId: id },
      relations: ['estudiante', 'course'],
    });

    if (!calificacion) {
      throw new NotFoundException(`Calificación con id ${id} no encontrada`);
    }

    return calificacion;
  }

  async findByEstudiante(estudianteId: number) {
    const calificaciones = await this.calificacionRepository.find({
      where: { estudiante: { id: estudianteId } },
      relations: ['course'], // Aquí puedes cargar también los cursos relacionados si lo deseas
    });

    if (!calificaciones || calificaciones.length === 0) {
      throw new NotFoundException(
        `No se encontraron calificaciones para el estudiante con ID ${estudianteId}`,
      );
    }

    return calificaciones;
  }

  async create(createCalificacionDto: CreateCalificacionDto) {
    const { studentId, courseId, ...rest } = createCalificacionDto;

    const estudiante = await this.estudianteRepository.findOneBy({
      id: studentId,
    });

    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    const course = await this.coursesRepository.findOneBy({ id: courseId });
    if (!course) throw new NotFoundException('Curso no encontrado');

    const calificacion = this.calificacionRepository.create({
      ...rest,
      estudiante,
      course,
    });

    try {
      await this.calificacionRepository.save(calificacion);
      return calificacion;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, updateCalificacionDto: UpdateCalificacionDto) {
    const calificacion = await this.calificacionRepository.findOneBy({
      gradesId: id,
    });

    if (!calificacion) {
      throw new NotFoundException(`Calificación con id ${id} no encontrada`);
    }

    const { studentId, courseId, ...rest } = updateCalificacionDto;

    if (studentId) {
      const estudiante = await this.estudianteRepository.findOneBy({
        id: studentId,
      });
      if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
      calificacion.estudiante = estudiante;
    }

    if (courseId) {
      const course = await this.coursesRepository.findOneBy({ id: courseId });
      if (!course) throw new NotFoundException('Curso no encontrado');
      calificacion.course = course;
    }

    Object.assign(calificacion, rest);

    try {
      await this.calificacionRepository.save(calificacion);
      return {
        message: 'Calificación actualizada correctamente',
        data: calificacion,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async deleteAllCalificaciones() {
    const query =
      this.calificacionRepository.createQueryBuilder('calificacion');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exists = await this.calificacionRepository.existsBy({ gradesId: id });

    if (!exists) {
      throw new NotFoundException(`Calificación con id ${id} no encontrada`);
    }

    await this.calificacionRepository.softDelete({ gradesId: id });

    return {
      message: `Calificación con ID ${id} eliminada correctamente`,
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
