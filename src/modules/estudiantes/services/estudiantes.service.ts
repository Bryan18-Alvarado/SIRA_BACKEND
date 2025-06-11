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
import { Tutor } from 'src/modules/tutores/entities/tutor.entity';
import { User } from 'src/auth/entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class EstudiantesService {
  private readonly logger = new Logger('EstudiantesService');

  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;

    const [data, total] = await this.estudianteRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: ['genero', 'tutor'],
    });

    return {
      data,
      total,
    };
  }

  async findCalificacionesByEstudiante(id: number) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['calificaciones', 'calificaciones.course'],
    });

    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }

    return estudiante.calificaciones; // Devuelve las calificaciones del estudiante
  }
  private calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  async create(
    createEstudianteDto: CreateEstudianteDto,
    user: User,
    imagenPath?: string,
  ): Promise<Estudiante> {
    try {
      const { fechaNacimiento, tutor_id, tutor, ...resData } =
        createEstudianteDto;

      const edad = this.calcularEdad(fechaNacimiento);
      let nuevoTutorId: number | undefined;

      if (edad < 18) {
        if (!tutor_id && !tutor) {
          throw new BadRequestException(
            'El estudiante es menor de edad y requiere un tutor asignado o registrado.',
          );
        }

        if (!tutor_id && tutor) {
          const tutorCreado = this.tutorRepository.create(tutor);
          const tutorGuardado = await this.tutorRepository.save(tutorCreado);
          nuevoTutorId = tutorGuardado.id;
        }
      }
      const nuevoUsuario = this.userRepository.create({
        email: createEstudianteDto.user.email,
        password: bcrypt.hashSync(createEstudianteDto.user.password, 10),
        fullName: `${resData.nombre} ${resData.apellido}`,
        roles: ['estudiante'],
      });

      await this.userRepository.save(nuevoUsuario);

      const estudiante = this.estudianteRepository.create({
        fechaNacimiento,
        ...resData,
        user: nuevoUsuario,
        tutor_id: tutor_id ?? nuevoTutorId,
        image: imagenPath,
      });

      const estudianteGuardado =
        await this.estudianteRepository.save(estudiante);

      estudianteGuardado.codigoEstudiante = `SR-${estudianteGuardado.id.toString().padStart(4, '0')}`;
      await this.estudianteRepository.save(estudianteGuardado);

      return estudianteGuardado;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.handleDBException(error);
      throw error;
    }
  }

  async validateUserByCodeAndEmail(
    codigoEstudiante: string,
    email: string,
  ): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { codigoEstudiante },
      relations: ['user'],
    });

    if (!estudiante) {
      throw new BadRequestException('Código de estudiante no válido.');
    }

    if (estudiante.user.email !== email) {
      throw new BadRequestException(
        'El correo electrónico no corresponde al código de estudiante.',
      );
    }

    return estudiante;
  }

  async update(
    id: number,
    updateEstudianteDto: Partial<CreateEstudianteDto>,
    user: User,
  ) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: {
        user: true,
        tutor: true,
        genero: true,
      },
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con id ${id} no encontrado`);
    }
    if (user) {
      estudiante.user = user;
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
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['tutor', 'genero'],
    });
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
