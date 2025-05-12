import { Module } from '@nestjs/common';
import { EstudiantesModule } from 'src/modules/estudiantes/estudiantes.module';
import { StudentCoursesModule } from 'src/modules/student-courses/student-courses.module';
import { DocentesModule } from 'src/modules/docentes/docentes.module';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { LevelModule } from '../modules/level/level.module';
import { AuthModule } from 'src/auth/auth.module';
// import { GendersModule } from 'src/modules/genders/genders.module'
import { SeedController } from './seed.controller';
@Module({
  imports: [
    EstudiantesModule,
    StudentCoursesModule,
    DocentesModule,
    CategoriesModule,
    // GendersModule,
    LevelModule,
    AuthModule,
  ],
  controllers: [SeedController],
})
export class SeedModule {}
