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

@Injectable()
export class CalificacionesService {
  private readonly logger = new Logger('CalificacionesService');

  constructor(
    @InjectRepository(Calificacion)
    private readonly calificacionRepository: Repository<Calificacion>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;
    return this.calificacionRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async create(createCalificacionDto: CreateCalificacionDto) {
    try {
      const calificacion = this.calificacionRepository.create(
        createCalificacionDto,
      );
      await this.calificacionRepository.save(calificacion);
      return calificacion;
    } catch (error) {
      //   console.error(error);
      //   throw new InternalServerErrorException('Ayuda!');
      this.handleDBException(error);
    }
  }

  async update(id: number, updateCalificacionDto: UpdateCalificacionDto) {
    const calificacion = await this.calificacionRepository.findOne({
      where: { gradesId: id },
    });

    if (!calificacion) {
      throw new NotFoundException(`Calificación con id ${id} no encontrada`);
    }
    try {
      this.calificacionRepository.merge(calificacion, updateCalificacionDto);
      await this.calificacionRepository.save(calificacion);
      return {
        message: 'Registro actualizado con éxito',
        data: calificacion,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exists = await this.calificacionRepository.existsBy({
      gradesId: id,
    });
    if (!exists) {
      throw new NotFoundException(`Calificación con id ${id} no encontrada`);
    }
    await this.calificacionRepository.softDelete({ gradesId: id }); // Soft delete deja fecha de eliminacion
    return {
      message: `Calificación con ID ${id} eliminada con éxito`,
      deletedAt: new Date(),
    };
  }

  async findOne(id: number) {
    const calificacion = await this.calificacionRepository.findOneBy({
      gradesId: id,
    });
    if (!calificacion) {
      throw new NotFoundException(`Calificación con id ${id} no encontrada`);
    }
    return calificacion;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Ocurrió un error inesperado. Intente más tarde',
    );
  }
}
