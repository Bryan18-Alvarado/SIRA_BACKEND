import { Module } from '@nestjs/common';
import { EstudiantesModule } from 'src/modules/estudiantes/estudiantes.module';
import { StudentCoursesModule } from 'src/modules/student-courses/student-courses.module';
import { DocentesModule } from 'src/modules/docentes/docentes.module';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { LevelModule } from '../modules/level/level.module';
import { AuthModule } from 'src/auth/auth.module';
// import { GendersModule } from 'src/modules/genders/genders.module'
import { SeedController } from './seed.controller';
import { CalificacionesModule } from 'src/modules/calificaciones/calificaciones.module';
import { CoursesModule } from 'src/modules/courses/courses.module';
import { SeedService } from './seed.service';
@Module({
  imports: [
    EstudiantesModule,
    StudentCoursesModule,
    DocentesModule,
    CategoriesModule,
    LevelModule,
    AuthModule,
    CalificacionesModule,
    CoursesModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
