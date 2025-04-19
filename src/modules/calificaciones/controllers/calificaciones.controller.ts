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

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatecalificacionDto: UpdateCalificacionDto, // O puedes crear un UpdateCalificacionDto
  ) {
    return this.calificacionesService.update(id, updatecalificacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.calificacionesService.remove(id);
  }
}
