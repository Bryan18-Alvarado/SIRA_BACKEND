import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Docente } from '../entities/docentes.entity';
import { CreateDocenteDto } from '../dto/docente-create.dto';

@Injectable()
export class DocentesService {
  private readonly logger = new Logger('DocentesService');

  constructor(
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
  ) {}

  findAll() {
    return this.docenteRepository.find({});
  }

  async create(createDocenteDto: CreateDocenteDto) {
    try {
      const docente = this.docenteRepository.create(createDocenteDto);
      await this.docenteRepository.save(docente);

      return docente;
    } catch (error) {
      // console.log(error);
      // throw new InternalServerErrorException('Ayuda!');
      this.handleDBException(error);
    }
  }
  async remove(id: number) {
    const docente = await this.findOne(id);
    await this.docenteRepository.remove(docente);
  }

  async findOne(id: number) {
    const docente = await this.docenteRepository.findOneBy({ id });
    if (!docente) {
      throw new NotFoundException(`docente con id ${id} no encontrado`);
    }
    return docente;
  }
  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
  }
}
