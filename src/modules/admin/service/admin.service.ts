// src/admin/admin.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUserByCodeAndEmail(
    codigo: string,
    email: string,
  ): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { codigo_admin: codigo },
      relations: ['user'],
    });

    if (!admin) {
      throw new BadRequestException('Código de administrador no válido.');
    }

    if (admin.user.email !== email) {
      throw new BadRequestException(
        'El correo electrónico no corresponde al código de administrador.',
      );
    }

    const userWithPassword = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: admin.user.id })
      .getOne();

    if (!userWithPassword) {
      throw new BadRequestException('Usuario no encontrado con password');
    }

    admin.user = userWithPassword;

    return admin;
  }
}
