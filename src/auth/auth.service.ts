import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ValidRoles } from './interfaces';
import { EstudiantesService } from 'src/modules/estudiantes/services/estudiantes.service';
import { DocentesService } from 'src/modules/docentes/services/docentes.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly estudiantesService: EstudiantesService,
    private readonly docentesService: DocentesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password, tipoUsuario, codigoEstudiante, codigo_laboral } =
      loginUserDto;

    let userEntity: User;

    if (tipoUsuario === 'estudiante') {
      if (!codigoEstudiante) {
        throw new BadRequestException('Debe proporcionar código de estudiante');
      }

      const estudiante =
        await this.estudiantesService.validateUserByCodeAndEmail(
          codigoEstudiante,
          email,
        );
      userEntity = estudiante.user;
    } else if (tipoUsuario === 'docente') {
      if (!codigo_laboral) {
        throw new BadRequestException('Debe proporcionar código laboral');
      }

      const docente = await this.docentesService.validateUserByCodeAndEmail(
        codigo_laboral,
        email,
      );
      userEntity = docente.user;
    } else {
      throw new BadRequestException('Tipo de usuario inválido');
    }

    if (!userEntity || !userEntity.password) {
      throw new BadRequestException('Credenciales no válidas');
    }

    const isPasswordValid = bcrypt.compareSync(password, userEntity.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Credenciales no válidas');
    }

    return {
      id: userEntity.id,
      email: userEntity.email,
      fullName: userEntity.fullName,
      roles: userEntity.roles,
      token: this.getJwtToken({ id: userEntity.id }),
    };
  }

  async updateRoles(userId: number, roles: ValidRoles[]) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new BadRequestException(`Usuario con id ${userId} no existe`);
    }

    user.roles = roles;
    await this.userRepository.save(user);
    return {
      message: `Roles actualizados para ${user.fullName}`,
      roles: user.roles,
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException(
      'Por favor chequea los logs del servidor',
    );
  }
}
