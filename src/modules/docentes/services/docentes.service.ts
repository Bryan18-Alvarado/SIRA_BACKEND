import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Docente } from '../entities/docentes.entity';
import {
  CreateDocenteDto,
  FilterDocenteDto,
  UpdateDocenteDto,
} from '../dto/docente-create.dto';

import { User } from 'src/auth/entities/user.entity';
import { Genders } from 'src/modules/genders/entities/genders.entity';
import { MaritalStatus } from 'src/modules/marital-status/entities/marital-status.entity';
import { Courses } from 'src/modules/courses/entities/courses.entity';

@Injectable()
export class DocentesService {
  private readonly logger = new Logger('DocentesService');

  constructor(
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
    @InjectRepository(Genders)
    private readonly genderRepository: Repository<Genders>,
    @InjectRepository(MaritalStatus)
    private readonly maritalStatusRepository: Repository<MaritalStatus>,
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
  ) {}

  async findAll(params?: FilterDocenteDto) {
    const { limit = 3, offset = 0, nombre } = params || {};

    const where = nombre ? { nombre: ILike(`%${nombre}%`) } : {};

    if (nombre) {
      where.nombre = ILike(`%${nombre}%`);
    }

    const [data, total] = await this.docenteRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      relations: ['genero', 'estado_civil', 'cursos_asignados'],
      order: {
        id: 'ASC',
      },
    });
    return [data, total];
  }

  async create(createDocenteDto: CreateDocenteDto, user: User) {
    try {
      const docente = this.docenteRepository.create({
        ...createDocenteDto,
        user,
      });
      await this.docenteRepository.save(docente);
      return docente;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, changes: UpdateDocenteDto, user: User) {
    const docente = await this.docenteRepository.findOne({
      where: { id },
      relations: { user: true, genero: true, estado_civil: true },
    });

    if (!docente) {
      throw new NotFoundException(`Docente con id ${id} no encontrado`);
    }

    if (user) {
      docente.user = user;
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
      docente.genero = genero;
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
      docente.estado_civil = estadoCivil;
    }

    if (changes.cursos_asignados_id) {
      const curso = await this.coursesRepository.findOneBy({
        id: changes.cursos_asignados_id,
      });
      if (!curso) {
        throw new NotFoundException(
          `Curso con id ${changes.cursos_asignados_id} no encontrado`,
        );
      }
      docente.cursos = curso;
    }

    this.docenteRepository.merge(docente, changes);
    const updated = await this.docenteRepository.save(docente);
    return {
      message: 'registro actualizado correctamente',
      data: updated,
    };
  }

  async deleteAllDocentes() {
    const query = this.docenteRepository.createQueryBuilder('docente');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exists = await this.docenteRepository.existsBy({ id });

    if (!exists) {
      throw new NotFoundException(`Docente con id ${id} no encontrado`);
    }

    await this.docenteRepository.softDelete(id);
    return {
      message: `Docente con id ${id} eliminado con éxito`,
      deletedAt: new Date(),
    };
  }

  async findOne(id: number) {
    const docente = await this.docenteRepository.findOne({
      where: { id: id },
      relations: { genero: true, estado_civil: true, cursos: true },
    });

    if (!docente) {
      throw new NotFoundException(`Docente con id ${id} no encontrado`);
    }
    return docente;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new BadRequestException('Error inesperado en la base de datos');
  }
}
