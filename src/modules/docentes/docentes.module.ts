import { Module } from '@nestjs/common';

import { DocentesController } from './controllers/docentes.controller';
import { Docente } from './entities/docentes.entity';
import { DocentesService } from './services/docentes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Genders } from '../genders/entities/genders.entity';
import { MaritalStatus } from '../marital-status/entities/marital-status.entity';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Docente, Genders, MaritalStatus]),
    AuthModule,
    CoursesModule,
  ],
  controllers: [DocentesController],
  providers: [DocentesService],
  exports: [TypeOrmModule, DocentesService],
})
export class DocentesModule {}
