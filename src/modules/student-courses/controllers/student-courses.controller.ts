import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateStudentCourseDto } from '../dto/create-student-course.dto';
import { StudentCoursesService } from '../services/student-courses.service';

@Controller('student-courses')
export class StudentCoursesController {
  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  @Get()
  getAllStudentCourses() {
    return 'Student Courses';
  }

  @Post()
  createStudentCourse(@Body() createStudentCourseDto: CreateStudentCourseDto) {
    return this.studentCoursesService.create(createStudentCourseDto);
  }
}
