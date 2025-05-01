import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateStudentCourseDto } from '../dto/studentcourse.dto';
import { StudentCoursesService } from '../services/studentcourses.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('studentcourses')
export class StudentCoursesController {
  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.studentCoursesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.studentCoursesService.findOne(id);
  }

  @Post()
  create(@Body() createStudentCourseDto: CreateStudentCourseDto) {
    return this.studentCoursesService.create(createStudentCourseDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateDto: CreateStudentCourseDto, // actualizar el dto
  ) {
    return this.studentCoursesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.studentCoursesService.remove(id);
  }
}
