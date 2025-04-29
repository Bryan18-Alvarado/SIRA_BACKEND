import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCoursesController } from './controllers/studentcourses.controller';
import { StudentCoursesService } from './services/studentcourses.service';
import { StudentCourse } from './entities/studentcourse.entity';
import { EstudiantesModule } from '../estudiantes/estudiantes.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentCourse]),
    EstudiantesModule,
    CoursesModule,
  ], // ← IMPORTANTE
  controllers: [StudentCoursesController],
  providers: [StudentCoursesService],
  exports: [TypeOrmModule, StudentCoursesService], // ← útil si lo usás fuera
})
export class StudentCoursesModule {}
