import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCoursesController } from './controllers/studentcourses.controller';
import { StudentCoursesService } from './services/studentcourses.service';
import { StudentCourse } from './entities/studentcourse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentCourse])], // ← IMPORTANTE
  controllers: [StudentCoursesController],
  providers: [StudentCoursesService],
  exports: [TypeOrmModule, StudentCoursesService], // ← útil si lo usás fuera
})
export class StudentCoursesModule {}
