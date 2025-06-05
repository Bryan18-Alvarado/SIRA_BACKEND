// src/modules/tutores/services/tutors.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Tutor } from '../entities/tutor.entity';
import {
  CreateTutorDto,
  FilterTutorDto,
  UpdateTutorDto,
} from '../dto/tutor.dto';
import { Genders } from 'src/modules/genders/entities/genders.entity';
import { MaritalStatus } from 'src/modules/marital-status/entities/marital-status.entity';

@Injectable()
export class TutoresService {
  private readonly logger = new Logger('TutorsService');

  constructor(
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
    @InjectRepository(Genders)
    private readonly genderRepository: Repository<Genders>,
    @InjectRepository(MaritalStatus)
    private readonly maritalStatusRepository: Repository<MaritalStatus>,
  ) {}

  async findAll(params?: FilterTutorDto) {
    const { limit = 3, offset = 0, nombre } = params || {};

    const where = nombre ? { nombre: ILike(`%${nombre}%`) } : {};

    const [data, total] = await this.tutorRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      relations: ['genero', 'estado_civil'],
      order: { id: 'ASC' },
    });

    return { data, total };
  }

  async findOne(id: number) {
    const tutor = await this.tutorRepository.findOne({
      where: { id },
      relations: ['genero', 'estado_civil'],
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor con id ${id} no encontrado`);
    }

    return tutor;
  }

  async create(createTutorDto: CreateTutorDto) {
    try {
      const tutor = this.tutorRepository.create(createTutorDto);
      await this.tutorRepository.save(tutor);
      return tutor;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, changes: UpdateTutorDto) {
    const tutor = await this.tutorRepository.findOne({
      where: { id },
      relations: { genero: true, estado_civil: true },
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor con id ${id} no encontrado`);
    }
    if (changes.genero_id) {
      const genero = await this.genderRepository.findOneBy({
        id: changes.genero_id,
      });
      if (!genero) {
        throw new NotFoundException(
          `Genero con id ${changes.genero_id} no encontrado`,
        );
      }
      tutor.genero = genero;
    }

    if (changes.estado_civil_id) {
      const estadoCivil = await this.maritalStatusRepository.findOneBy({
        id: changes.estado_civil_id,
      });
      if (!estadoCivil) {
        throw new NotFoundException(
          `Estado civil con id ${changes.estado_civil_id} no encontrado`,
        );
      }
      tutor.estado_civil = estadoCivil;
    }

    this.tutorRepository.merge(tutor, changes);
    try {
      const updated = await this.tutorRepository.save(tutor);
      return {
        message: 'Registro actualizado con éxito',
        data: updated,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const tutor = await this.tutorRepository.findOne({
      where: { id },
      relations: ['estudiantes'],
    });
    if (!tutor) {
      throw new NotFoundException(`Tutor con id ${id} no encontrado`);
    }
    if (tutor.estudiantes && tutor.estudiantes.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar el tutor porque tiene estudiantes asignados',
      );
    }
    await this.tutorRepository.softDelete(id);
    return {
      message: `Tutor con id ${id} eliminado con éxito`,
      deletedAt: new Date(),
    };
  }

  private handleDBException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new BadRequestException('Error inesperado en la base de datos');
  }
}
