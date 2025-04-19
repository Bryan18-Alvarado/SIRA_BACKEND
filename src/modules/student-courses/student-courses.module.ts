import { Module } from '@nestjs/common';
import { StudentCoursesController } from './controllers/student-courses.controller';
import { StudentCoursesService } from './services/student-courses.service';

@Module({
  controllers: [StudentCoursesController],
  providers: [StudentCoursesService]
})
export class StudentCoursesModule {}
