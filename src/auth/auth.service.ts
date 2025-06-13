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
import { AdminService } from 'src/modules/admin/service/admin.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly estudiantesService: EstudiantesService,
    private readonly docentesService: DocentesService,
    private readonly adminService: AdminService, // Asegúrate de importar el servicio de Admin
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
    const { email, password, codigo } = loginUserDto;

    let userEntity: User | null = null;

    // Intentar como admin
    try {
      const admin = await this.adminService.validateUserByCodeAndEmail(
        codigo,
        email,
      );
      userEntity = admin.user;
    } catch (error) {
      // Si no es admin, intentamos como estudiante
      try {
        const estudiante =
          await this.estudiantesService.validateUserByCodeAndEmail(
            codigo,
            email,
          );
        userEntity = estudiante.user;
      } catch (error) {
        // Si no es estudiante, intentamos como docente
        try {
          const docente = await this.docentesService.validateUserByCodeAndEmail(
            codigo,
            email,
          );
          userEntity = docente.user;
        } catch (error) {
          // Si no es docente, intentamos como usuario común
          userEntity = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .getOne();

          if (!userEntity)
            throw new BadRequestException('Usuario no encontrado');
        }
      }
    }

    if (!userEntity?.password) {
      throw new BadRequestException('Credenciales no válidas');
    }

    const isPasswordValid = bcrypt.compareSync(password, userEntity.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Credenciales no válidas');
    }

    return {
      id: userEntity.id,
      email: userEntity.email,
      userName: userEntity.userName,
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
      message: `Roles actualizados para ${user.userName}`,
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
