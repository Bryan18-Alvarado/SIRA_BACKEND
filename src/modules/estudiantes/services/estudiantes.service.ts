import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../entities/estudiante.entity';
import { CreateEstudianteDto } from '../dto/estudiantes.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
@Injectable()
export class EstudiantesService {
  private readonly logger = new Logger('EstudiantesService');

  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;

    const [data, total] = await this.estudianteRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    return {
      data,
      total,
    };
  }

  // Método que obtiene las calificaciones de un estudiante por su ID
  async findCalificacionesByEstudiante(id: number) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['calificaciones', 'calificaciones.course'], // Asegúrate de tener la relación correcta con calificaciones
    });

    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }

    return estudiante.calificaciones; // Devuelve las calificaciones del estudiante
  }

  async create(createEstudianteDto: CreateEstudianteDto) {
    try {
      const estudiante = this.estudianteRepository.create(createEstudianteDto);
      await this.estudianteRepository.save(estudiante);
      return estudiante;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, updateEstudianteDto: Partial<CreateEstudianteDto>) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con id ${id} no encontrado`);
    }
    try {
      this.estudianteRepository.merge(estudiante, updateEstudianteDto);
      await this.estudianteRepository.save(estudiante);
      return {
        message: 'Registro actualizado con éxito',
        data: estudiante,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async deleteAllEstudiantes() {
    const query = this.estudianteRepository.createQueryBuilder('estudiante');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exists = await this.estudianteRepository.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(`Estudiante con id ${id} no encontrado`);
    }
    await this.estudianteRepository.softDelete({ id });
    return {
      message: `Estudiante con ID ${id} eliminado con éxito`,
      deletedAt: new Date(),
    };
  }

  async findOne(id: number) {
    const estudiante = await this.estudianteRepository.findOneBy({ id });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con id ${id} no encontrado`);
    }
    return estudiante;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Ocurrió un error inesperado. Intente más tarde',
    );
  }
}
