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
import {
  CreateEstudianteDto,
  UpdateEstudianteDto,
} from '../dto/estudiantes.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Tutor } from 'src/modules/tutores/entities/tutor.entity';
import { User } from 'src/auth/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { StudentCourse } from 'src/modules/student-courses/entities/studentcourse.entity';
import { Genders } from 'src/modules/genders/entities/genders.entity';
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
    @InjectRepository(StudentCourse)
    private readonly studentCourseRepository: Repository<StudentCourse>,
    @InjectRepository(Genders)
    private readonly generoRepository: Repository<Genders>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;

    const [data, total] = await this.estudianteRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: ['genero', 'tutor', 'user', 'cursos'],
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
      const { fechaNacimiento, tutor_id, tutor, cursos_ids, ...resData } =
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

      const estudiante = this.estudianteRepository.create({
        fechaNacimiento,
        ...resData,
        tutor_id: tutor_id ?? nuevoTutorId,
        image: imagenPath,
      });

      const estudianteGuardado =
        await this.estudianteRepository.save(estudiante);

      estudianteGuardado.codigoEstudiante = `SR-${estudianteGuardado.id.toString().padStart(4, '0')}`;
      await this.estudianteRepository.save(estudianteGuardado);

      // Ahora crear el usuario
      const passwordTemporal = 'SIRA-estudiante321#';
      const nuevoUsuario = this.userRepository.create({
        email: createEstudianteDto.user.email,
        password: bcrypt.hashSync(passwordTemporal, 10),
        userName: `${resData.nombre} ${resData.apellido}`,
        roles: ['estudiante'],
      });

      const usuarioGuardado = await this.userRepository.save(nuevoUsuario);

      // Asociar el usuario al estudiante
      estudianteGuardado.user = usuarioGuardado;

      // Guardar el estudiante con el usuario asociado
      await this.estudianteRepository.save(estudianteGuardado);
      if (cursos_ids && cursos_ids.length > 0) {
        const studentCourses = cursos_ids.map((courseId) => ({
          studentId: estudianteGuardado.id,
          coursesId: courseId,
          enrollmentDate: new Date(),
        }));

        await this.studentCourseRepository.save(studentCourses);
      }

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
    codigo: string,
    email: string,
  ): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { codigoEstudiante: codigo },
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
    const userWithPassword = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: estudiante.user.id })
      .getOne();
    if (!userWithPassword) {
      throw new BadRequestException('Usuario no encontrado con password');
    }

    estudiante.user = userWithPassword;

    return estudiante;
  }

  async update(id: number, changes: UpdateEstudianteDto) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: {
        user: true,
        tutor: true,
        genero: true,
        cursos: true,
        calificaciones: true,
      },
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con id ${id} no encontrado`);
    }

    if (changes.tutor_id) {
      const tutor = await this.tutorRepository.findOneBy({
        id: changes.tutor_id,
      });
      if (!tutor)
        throw new NotFoundException(
          `Tutor con id ${changes.tutor_id} no encontrado`,
        );
      estudiante.tutor = tutor;
    }

    if (changes.genero_id) {
      const genero = await this.generoRepository.findOneBy({
        id: changes.genero_id,
      });
      if (!genero)
        throw new NotFoundException(
          `Genero con id ${changes.genero_id} no encontrado`,
        );
      estudiante.genero = genero;
    }

    if (estudiante.user) {
      // Actualizar el email del usuario si cambia el email del estudiante
      if (changes.email) {
        estudiante.user.email = changes.email;
      }

      // Actualizar el userName con nombre y apellido combinados
      const nombre = changes.nombre ?? estudiante.nombre;
      const apellido = changes.apellido ?? estudiante.apellido;
      estudiante.user.userName = `${nombre} ${apellido}`;

      // Guardar los cambios en el usuario
      await this.userRepository.save(estudiante.user);
    }

    this.estudianteRepository.merge(estudiante, changes);

    const updated = await this.estudianteRepository.save(estudiante);
    return {
      message: 'registro actualizado correctamente',
      data: updated,
    };
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
      relations: ['tutor', 'genero', 'user', 'cursos'],
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
