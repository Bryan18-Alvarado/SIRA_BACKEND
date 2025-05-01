import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Put,
} from '@nestjs/common';
import { CalificacionesService } from '../services/calificaciones.service';
import {
  CreateCalificacionDto,
  UpdateCalificacionDto,
} from '../dto/calificacion.dto/calificacion.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.calificacionesService.findAll(paginationDto);
  }

  @Post()
  create(@Body() createCalificacionDto: CreateCalificacionDto) {
    return this.calificacionesService.create(createCalificacionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.calificacionesService.findOne(id);
  }

  @Get('estudiante/:id')
  async findByEstudiante(@Param('id') id: number) {
    return await this.calificacionesService.findByEstudiante(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCalificacionDto: UpdateCalificacionDto,
  ) {
    return this.calificacionesService.update(+id, updateCalificacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.calificacionesService.remove(id);
  }
}
