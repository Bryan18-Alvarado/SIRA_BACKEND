import { Injectable } from '@nestjs/common';
import { EstudiantesService } from 'src/modules/estudiantes/services/estudiantes.service';
import { initialData } from './data/seed-data';
import { Estudiante } from 'src/modules/estudiantes/entities/estudiante.entity';
import { CalificacionesService } from 'src/modules/calificaciones/services/calificaciones.service';
import { CoursesService } from 'src/modules/courses/services/courses.service';
import { StudentCoursesService } from 'src/modules/student-courses/services/studentcourses.service';
import { Calificacion } from 'src/modules/calificaciones/entities/calificacion.entity';
import { Courses } from 'src/modules/courses/entities/courses.entity';
import { StudentCourse } from 'src/modules/student-courses/entities/studentcourse.entity';
import { DocentesService } from 'src/modules/docentes/services/docentes.service';
import { Docente } from 'src/modules/docentes/entities/docentes.entity';
import { CategoriesService } from 'src/modules/categories/services/categories.service';
import { Categories } from '../modules/categories/entities/categories.entity';
import { Level } from 'src/modules/level/entities/level.entity';
import { LevelService } from 'src/modules/level/services/level.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly estudiantesService: EstudiantesService,
    private readonly calificacionesService: CalificacionesService,
    private readonly coursesService: CoursesService,
    private readonly studentCoursesService: StudentCoursesService,
    private readonly docentesService: DocentesService,
    private readonly categoriesService: CategoriesService,
    private readonly levelService: LevelService,
  ) {}

  async runSeed() {
    try {
      // Primero eliminamos los registros existentes
      await this.studentCoursesService.deleteAllStudentcourses();
      console.log('Student Courses deleted');
      await this.calificacionesService.deleteAllCalificaciones();
      console.log('Calificaciones deleted');
      await this.estudiantesService.deleteAllEstudiantes();
      console.log('Estudiantes deleted');
      await this.coursesService.deleteAllCourses();
      console.log('Courses deleted');
      await this.docentesService.deleteAllDocentes();
      console.log('Docentes deleted');
      await this.categoriesService.deleteAllCategories();
      console.log('Categories deleted');
      await this.levelService.deleteAllLevels();
      console.log('Levels deleted');

      // Inicio del  bloque de inserción de datos, si se comenta este bloque, solo eliminara los dato sin insertar datos por defecto
      // Luego insertamos las entidades base
      // await this.insertNewCategories(); // Primero las categorías
      // console.log('Categories inserted');
      // await this.insertNewDocente(); // Luego los docentes
      // console.log('Docentes inserted');
      // await this.insertNewEstudiante(); // Después los estudiantes
      // console.log('Estudiantes inserted');
      // await this.insertNewLevels(); // Luego los niveles
      // console.log('Levels inserted');

      // await this.insertNewCourses(); // Luego los cursos, ya que dependen de las categorías y docentes
      // console.log('Courses inserted');

      // // Finalmente insertamos las relaciones
      // await this.insertNewCalificacion();
      // console.log('Calificaciones inserted');
      // await this.insertNewStudentCourses();
      // console.log('Student Courses inserted');

      return 'SEED EXECUTED';
      // Fin del bloque de inserción de datos
      // Si se desea eliminar los datos y no insertar nada, se puede comentar el bloque de inserción de datos
    } catch (error) {
      console.error('Error during seed execution:', error);
      throw error;
    }
  }

  private async insertNewEstudiante() {
    await this.estudiantesService.deleteAllEstudiantes();

    const estudiantes = initialData.estudiantes;
    const insertPromises: Promise<Estudiante | undefined>[] = [];

    estudiantes.forEach((estudiante) => {
      insertPromises.push(this.estudiantesService.create(estudiante));
    });

    await Promise.all(insertPromises);
    return true;
  }
  // private async insertNewDocente() {
  //   await this.docentesService.deleteAllDocentes();

  //   const docentes = initialData.docentes;
  //   const insertPromises: Promise<Docente | undefined>[] = [];

  //   docentes.forEach((docente) => {
  //     insertPromises.push(this.docentesService.create(docente));
  //   });

  //   await Promise.all(insertPromises);
  //   return true;
  // }

  private async insertNewCalificacion() {
    await this.calificacionesService.deleteAllCalificaciones();

    const calificaciones = initialData.calificaciones;
    const insertPromises: Promise<Calificacion | undefined>[] = [];

    calificaciones.forEach((calificaciones) => {
      insertPromises.push(this.calificacionesService.create(calificaciones));
    });

    await Promise.all(insertPromises);
    return true;
  }
  private async insertNewCategories() {
    await this.categoriesService.deleteAllCategories();

    const categories = initialData.categories;
    const insertPromises: Promise<Categories | undefined>[] = [];

    categories.forEach((categories) => {
      insertPromises.push(this.categoriesService.create(categories));
    });

    await Promise.all(insertPromises);
    return true;
  }

  private async insertNewCourses() {
    await this.coursesService.deleteAllCourses();

    const courses = initialData.courses;
    const insertPromises: Promise<Courses | undefined>[] = [];

    courses.forEach((courses) => {
      insertPromises.push(this.coursesService.create(courses));
    });

    await Promise.all(insertPromises);
    return true;
  }
  private async insertNewStudentCourses() {
    await this.studentCoursesService.deleteAllStudentcourses();

    const studentcourses = initialData.studentCourses;
    const insertPromises: Promise<StudentCourse | undefined>[] = [];

    studentcourses.forEach((studentcourses) => {
      insertPromises.push(this.studentCoursesService.create(studentcourses));
    });

    await Promise.all(insertPromises);
    return true;
  }

  private async insertNewLevels() {
    await this.levelService.deleteAllLevels();

    const levels = initialData.levels;
    const insertPromises: Promise<Level | undefined>[] = [];

    levels.forEach((level) => {
      insertPromises.push(this.levelService.create(level));
    });

    await Promise.all(insertPromises);
    return true;
  }
}
