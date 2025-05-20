// import { Auth } from 'src/auth/decorators';
import { SeedService } from './seed.service';
import { Controller, Delete, Get } from '@nestjs/common';
// import { ValidRoles } from 'src/auth/interfaces';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('estudiantes')
  async seedEstudiantes() {
    await this.seedService['insertNewEstudiante']();
    return 'SEED ESTUDIANTES EXECUTED';
  }

  @Get('calificaciones')
  async seedCalificaciones() {
    await this.seedService['insertNewCalificacion']();
    return 'SEED CALIFICACIONES EXECUTED';
  }

  // @Get('docentes')
  // async seedDocentes() {
  //   await this.seedService['insertNewDocente']();
  //   return 'SEED DOCENTES EXECUTED';
  // }

  @Get('courses')
  async seedCourses() {
    await this.seedService['insertNewCourses']();
    return 'SEED COURSES EXECUTED';
  }

  @Get('studentcourses')
  async seedStudentCourses() {
    await this.seedService['insertNewStudentCourses']();
    return 'SEED STUDENT COURSES EXECUTED';
  }

  @Get('categories')
  async seedCategories() {
    await this.seedService['insertNewCategories']();
    return 'SEED CATEGORIES EXECUTED';
  }

  @Get('levels')
  async seedLevels() {
    await this.seedService['insertNewLevels']();
    return 'SEED LEVELS EXECUTED';
  }

  @Get('all')
  async seedAll() {
    return await this.seedService.runSeed();
  }
}
