import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionesService } from './services/calificaciones.service';
import { CalificacionesController } from './controllers/calificaciones.controller';
import { Calificacion } from './entities/calificacion.entity';
import { StudentCourse } from '../student-courses/entities/studentcourse.entity';

@Module({
  imports: [
    CalificacionesModule,
    TypeOrmModule.forFeature([Calificacion, StudentCourse]),
  ],
  controllers: [CalificacionesController],
  providers: [CalificacionesService],
  exports: [CalificacionesService, TypeOrmModule],
})
export class CalificacionesModule {}
