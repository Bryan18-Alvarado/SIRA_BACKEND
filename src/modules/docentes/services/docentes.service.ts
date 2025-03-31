import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createDocenteDto } from '../dto/docente-create.dto';
import { Repository } from 'typeorm';
import { Docente } from '../entities/docentes.entity';

@Injectable()
export class DocentesService {
  constructor(
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
  ) {}

  async createDocente(createDocenteDto: createDocenteDto) {
    try {
      const docente = this.docenteRepository.create(createDocenteDto);
      await this.docenteRepository.save(docente);

      return docente;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ayuda!');
    }
  }
}
