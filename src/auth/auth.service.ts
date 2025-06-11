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
    console.log('Login request received:', loginUserDto);
    const { email, password, codigoEstudiante, codigo_laboral } = loginUserDto;

    let userEntity: User | null;

    if (codigoEstudiante) {
      const estudiante =
        await this.estudiantesService.validateUserByCodeAndEmail(
          codigoEstudiante,
          email,
        );
      if (!estudiante)
        throw new BadRequestException('Código de estudiante no válido');
      userEntity = estudiante.user;
    } else if (codigo_laboral) {
      const docente = await this.docentesService.validateUserByCodeAndEmail(
        codigo_laboral,
        email,
      );
      if (!docente) throw new BadRequestException('Código laboral no válido');
      userEntity = docente.user;
    } else {
      // Usuario común sin código: busca solo por email
      console.log('Buscando usuario con email:', email);
      userEntity = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();
      console.log('Usuario encontrado:', userEntity);

      if (!userEntity) throw new BadRequestException('Usuario no encontrado');
    }

    if (!userEntity.password) {
      throw new BadRequestException('Credenciales no válidas');
    }
    console.log('Password enviado:', password);
    console.log('Hash en DB:', userEntity.password);
    const isPasswordValid = bcrypt.compareSync(password, userEntity.password);
    console.log('¿Contraseña válida?', isPasswordValid);
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
