import { Module } from '@nestjs/common';
import { EstudiantesModule } from './modules/estudiantes/estudiantes.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionesModule } from './modules/calificaciones/calificaciones.module';
import { CalificacionesService } from './modules/calificaciones/services/calificaciones.service';
import { CalificacionesController } from './modules/calificaciones/controllers/calificaciones.controller';
import { StudentCoursesModule } from './modules/student-courses/student-courses.module';
import { DocentesModule } from './modules/docentes/docentes.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DocentesController } from './modules/docentes/controllers/docentes.controller';
import { CategoriesController } from './modules/categories/controllers/categories.controller';
import { EstudiantesController } from './modules/estudiantes/controllers/estudiantes.controller';
import { DocentesService } from './modules/docentes/services/docentes.service';
import { CategoriesService } from './modules/categories/services/categories.service';
import { EstudiantesService } from './modules/estudiantes/services/estudiantes.service';
import { CommonModule } from './common/common.module';
import { CoursesController } from './modules/courses/controllers/courses.controller';
import { CoursesService } from './modules/courses/services/courses.service';
import { CoursesModule } from './modules/courses/courses.module';
import { StudentCoursesController } from './modules/student-courses/controllers/studentcourses.controller';
import { StudentCoursesService } from './modules/student-courses/services/studentcourses.service';
import { AuthModule } from './auth/auth.module';
import { LevelController } from './modules/level/controllers/level.controller';
import { LevelService } from './modules/level/services/level.service';
import { LevelModule } from './modules/level/level.module';
import { SeedModule } from './seed/seed.module';
import { GendersController } from './modules/genders/controllers/genders.controller';
import { GendersService } from './modules/genders/services/genders.service';
import { MaritalStatusController } from './modules/marital-status/controllers/marital-status.controller';
import { MaritalStatusService } from './modules/marital-status/services/marital-status.service';
import { MaritalStatusModule } from './modules/marital-status/maritalStatus.module';
import { GendersModule } from './modules/genders/genders.module';
import { ReportModule } from './modules/report/report.module';
import { ReportController } from './modules/report/controllers/report.controller';
import { ReportService } from './modules/report/service/report.service';
import { TutoresService } from './modules/tutores/services/tutores.service';
import { TutoresController } from './modules/tutores/controllers/tutores.controller';

@Module({
  imports: [
    EstudiantesModule,
    DocentesModule,
    CategoriesModule,
    CoursesModule,
    StudentCoursesModule,
    CalificacionesModule,
    LevelModule,
    MaritalStatusModule,
    GendersModule,
    ReportModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CommonModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [
    DocentesController,
    CalificacionesController,
    CategoriesController,
    EstudiantesController,
    CoursesController,
    StudentCoursesController,
    LevelController,
    GendersController,
    MaritalStatusController,
    ReportController,
    TutoresController,
  ],
  providers: [
    DocentesService,
    CategoriesService,
    EstudiantesService,
    CoursesService,
    CalificacionesService,
    StudentCoursesService,
    LevelService,
    GendersService,
    MaritalStatusService,
    ReportService,
    TutoresService,
  ],
})
export class AppModule {}

