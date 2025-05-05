import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { EstudiantesModule } from 'src/modules/estudiantes/estudiantes.module';
import { CalificacionesModule } from 'src/modules/calificaciones/calificaciones.module';
import { CoursesModule } from 'src/modules/courses/courses.module';
import { StudentCoursesModule } from 'src/modules/student-courses/student-courses.module';
import { DocentesModule } from 'src/modules/docentes/docentes.module';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { LevelModule } from '../modules/level/level.module';
@Module({
  imports: [
    EstudiantesModule,
    CalificacionesModule,
    CoursesModule,
    StudentCoursesModule,
    DocentesModule,
    CategoriesModule,
    LevelModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
