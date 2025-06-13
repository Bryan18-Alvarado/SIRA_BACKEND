// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { User } from 'src/auth/entities/user.entity';
import { AdminService } from './service/admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, User])],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
