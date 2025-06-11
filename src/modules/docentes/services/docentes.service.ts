import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
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
import * as bcrypt from 'bcrypt';

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
    private readonly courseRepository: Repository<Courses>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      relations: ['genero', 'estado_civil', 'courses'],
      order: {
        id: 'ASC',
      },
    });
    return [data, total];
  }

  async create(
    createDocenteDto: CreateDocenteDto,
    user: User,
    imagePath?: string,
  ) {
    try {
      const nuevoUsuario = this.userRepository.create({
        email: createDocenteDto.user.email,
        password: bcrypt.hashSync(createDocenteDto.user.password, 10),
        fullName: `${createDocenteDto.nombre} ${createDocenteDto.apellido}`,
        roles: ['docente'],
      });

      await this.userRepository.save(nuevoUsuario);

      const docente = this.docenteRepository.create({
        ...createDocenteDto,
        user: nuevoUsuario,
        image: imagePath,
      });

      if (createDocenteDto.cursos_ids?.length) {
        const cursos = await this.courseRepository.find({
          where: { id: In(createDocenteDto.cursos_ids) },
        });

        if (cursos.length !== createDocenteDto.cursos_ids.length) {
          throw new NotFoundException('Uno o más cursos no fueron encontrados');
        }

        docente.courses = cursos;
      }

      await this.docenteRepository.save(docente);

      return {
        message: 'Docente creado correctamente',
        data: docente,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async validateUserByCodeAndEmail(
    codigo_laboral: string,
    email: string,
  ): Promise<Docente> {
    const docente = await this.docenteRepository.findOne({
      where: { codigo_laboral },
      relations: ['user'],
    });

    if (!docente) {
      throw new BadRequestException('Código laboral no válido.');
    }

    if (docente.user.email !== email) {
      throw new BadRequestException(
        'El correo electrónico no corresponde al código laboral.',
      );
    }

    return docente;
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
    this.docenteRepository.merge(docente, changes);

    if (changes.cursos_ids?.length) {
      const cursos = await this.courseRepository.find({
        where: { id: In(changes.cursos_ids) },
      });

      if (cursos.length !== changes.cursos_ids.length) {
        throw new NotFoundException('Uno o más cursos no fueron encontrados');
      }

      docente.courses = cursos;
    }

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
      relations: { genero: true, estado_civil: true, courses: true },
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
