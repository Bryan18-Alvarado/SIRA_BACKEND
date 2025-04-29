import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionesService } from './services/calificaciones.service';
import { CalificacionesController } from './controllers/calificaciones.controller';
import { Calificacion } from './entities/calificacion.entity';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { Courses } from '../courses/entities/courses.entity';

@Module({
  imports: [
    CalificacionesModule,
    TypeOrmModule.forFeature([Calificacion, Estudiante, Courses]),
  ],
  controllers: [CalificacionesController],
  providers: [CalificacionesService],
  exports: [CalificacionesService, TypeOrmModule],
})
export class CalificacionesModule {}
