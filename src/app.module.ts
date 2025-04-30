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

@Module({
  imports: [
    EstudiantesModule,
    DocentesModule,
    CategoriesModule,
    CoursesModule,
    StudentCoursesModule,
    CalificacionesModule,
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres', //Tipo de BD a utiliza
      host: process.env.DB_HOST, //Define la dirección del servidor de la base de datos.
      port: Number(process.env.DB_PORT), //Especifica el puerto en el que el servidor de la base de datos está escuchando
      database: process.env.DB_NAME, //Indica el nombre de la base de datos a la que se conectará la aplicación
      username: process.env.DB_USER, //Especifica el nombre de usuario que se utilizará para autenticar la conexión a la base de datos
      password: process.env.DB_PASSWORD, //Define la contraseña del usuario que se utilizará para la conexión a la base de datos
      autoLoadEntities: true, //Si se establece en true, TypeORM cargará automáticamente todas las entidades que estén registradas en los módulos de la aplicación.
      synchronize: true, //Si se establece en true, TypeORM sincronizará automáticamente la estructura de la base de datos con las entidades definidas en el código cada vez que se inicie la aplicación.
    }),
    CommonModule,
    AuthModule,
  ],
  controllers: [
    DocentesController,
    CalificacionesController,
    CategoriesController,
    EstudiantesController,
    CoursesController,
    StudentCoursesController,
  ],
  providers: [
    DocentesService,
    CategoriesService,
    EstudiantesService,
    CoursesService,
    CalificacionesService,
    StudentCoursesService,
  ],
})
export class AppModule {}
