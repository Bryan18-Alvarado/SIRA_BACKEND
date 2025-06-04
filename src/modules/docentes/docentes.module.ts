import { Module } from '@nestjs/common';

import { DocentesController } from './controllers/docentes.controller';
import { Docente } from './entities/docentes.entity';
import { DocentesService } from './services/docentes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Genders } from '../genders/entities/genders.entity';
import { MaritalStatus } from '../marital-status/entities/marital-status.entity';
import { Courses } from '../courses/entities/courses.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Docente, Genders, MaritalStatus, Courses]),
    AuthModule,
  ],
  controllers: [DocentesController],
  providers: [DocentesService],
  exports: [TypeOrmModule, DocentesService],
})
export class DocentesModule {}
