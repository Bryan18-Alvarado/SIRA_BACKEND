import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Docente } from '../entities/docentes.entity';
import { CreateDocenteDto, UpdateDocenteDto } from '../dto/docente-create.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class DocentesService {
  private readonly logger = new Logger('DocentesService');

  constructor(
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
  ) {}

  findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;
    return this.docenteRepository.find({
      take: limit,
      skip: offset,
    });
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
  // async remove(id: number) {
  //   const docente = await this.findOne(id);
  //   await this.docenteRepository.remove(docente);
  // }

  async update(id: number, updateDocenteDto: UpdateDocenteDto) {
    const docente = await this.docenteRepository.findOne({ where: { id } });

    if (!docente) {
      throw new NotFoundException(`docente con id ${id} no encontrado`);
    }
    try {
      this.docenteRepository.merge(docente, updateDocenteDto);
      await this.docenteRepository.save(docente);
      return {
        message: 'registro actualizado con exito',
        data: docente,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exists = await this.docenteRepository.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(`docente con id ${id} no encontrado`);
    }
    await this.docenteRepository.softDelete({ id });
    return {
      message: `Docente con id ${id} eliminado con exito`,
      deleteAt: new Date(),
    };
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
