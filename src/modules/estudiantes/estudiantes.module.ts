import { Module } from '@nestjs/common';
import { EstudiantesController } from './controllers/estudiantes.controller';
import { EstudiantesService } from './services/estudiantes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity'; // Importamos la entidad Estudiante
import { Tutor } from '../tutores/entities/tutor.entity';
import { TutoresModule } from '../tutores/tutores.module';
import { User } from 'src/auth/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { StudentCourse } from '../student-courses/entities/studentcourse.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estudiante, Tutor, User, StudentCourse]),
    TutoresModule,
    PassportModule,
  ], // Importamos el módulo TypeOrmModule y registramos la entidad Estudiante
  controllers: [EstudiantesController],
  providers: [EstudiantesService],
  exports: [TypeOrmModule, EstudiantesService], // Exportamos el servicio para que pueda ser utilizado en otros módulos
})
export class EstudiantesModule {}
