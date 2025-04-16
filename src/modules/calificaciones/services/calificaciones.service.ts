import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from '../entities/calificacion.entity';
import { CreateCalificacionDto } from '../dto/calificacion.dto/calificacion.dto';

@Injectable()
export class CalificacionesService {
  constructor(
    @InjectRepository(Calificacion)
    private readonly calificacionRepository: Repository<Calificacion>,
  ) {}

  async create(createCalificacionDto: CreateCalificacionDto) {
    try {
      const calificacion = this.calificacionRepository.create(
        createCalificacionDto,
      );
      await this.calificacionRepository.save(calificacion);

      return calificacion;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear la calificación');
    }
  }
}
