import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoursesService } from '../services/courses.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateCoursesDto, UpdateCoursesDto } from '../dto/courses.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.coursesService.findAll(paginationDto);
  }

  @Post()
  createCourse(@Body() createCourseDto: CreateCoursesDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCoursesDto: UpdateCoursesDto) {
    return this.coursesService.update(id, updateCoursesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coursesService.remove(id);
  }
}
