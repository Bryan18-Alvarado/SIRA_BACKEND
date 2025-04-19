import { Body, Controller, Get, Post } from '@nestjs/common';
import { CalificacionesService } from '../services/calificaciones.service';
import { CreateCalificacionDto } from '../dto/calificacion.dto/calificacion.dto';

@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Get()
  getAllCalificaciones() {
    return 'Calificaciones';
  }

  @Post()
  createCalificacion(@Body() createCalificacionDto: CreateCalificacionDto) {
    return this.calificacionesService.create(createCalificacionDto);
  }
}
