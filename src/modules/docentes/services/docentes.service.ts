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
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class DocentesService {
  private readonly logger = new Logger('DocentesService');

  constructor(
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;
    return this.docenteRepository.find({
      take: limit,
      skip: offset,
    });
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

  async update(id: number, updateDocenteDto: UpdateDocenteDto, user: User) {
    const docente = await this.docenteRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!docente) {
      throw new NotFoundException(`Docente con id ${id} no encontrado`);
    }

    if (user) {
      docente.user = user;
    }

    try {
      this.docenteRepository.merge(docente, updateDocenteDto);
      await this.docenteRepository.save(docente);
      return {
        message: 'Registro actualizado con éxito',
        data: docente,
      };
    } catch (error) {
      this.handleDBException(error);
    }
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
    const exists = await this.docenteRepository.exist({ where: { id } });

    if (!exists) {
      throw new NotFoundException(`Docente con id ${id} no encontrado`);
    }

    await this.docenteRepository.softDelete({ id });
    return {
      message: `Docente con id ${id} eliminado con éxito`,
      deletedAt: new Date(),
    };
  }

  async findOne(id: number) {
    const docente = await this.docenteRepository.findOneBy({ id });
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
