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
import { CoursesService } from '../services/courses.service';
import {
  CreateCoursesDto,
  FilterCoursesDto,
  UpdateCoursesDto,
} from '../dto/courses.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getFindAll(@Query() params: FilterCoursesDto) {
    const rows = await this.coursesService.findAll(params);
    const data = {
      data: rows,
    };
    return data;
  }

  @Post()
  async createCourse(@Body() createCourseDto: CreateCoursesDto) {
    const nuevo = await this.coursesService.create(createCourseDto);
    const data = {
      data: nuevo,
      message: 'Registro creado correctamente',
    };
    return data;
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const rows = await this.coursesService.findOne(id);
    const data = {
      data: rows,
    };
    return data;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCoursesDto: UpdateCoursesDto,
  ) {
    const datos = await this.coursesService.update(id, updateCoursesDto);
    const data = {
      data: datos,
      message: 'Registro actualizado correctamente',
    };
    return data;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const datos = await this.coursesService.remove(id);
    const data = {
      data: datos,
      message: 'Registro eliminado correctamente',
    };
    return data;
  }
}
