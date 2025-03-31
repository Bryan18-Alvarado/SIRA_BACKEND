import { Body, Controller, Get, Post } from '@nestjs/common';
import { EstudiantesService } from '../services/estudiantes.service';
import { CreateEstudianteDto } from '../dto/estudiantes.dto';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudianeteService: EstudiantesService) {}
  @Get()
  getEstudiantesAll() {
    return 'Estudiantes';
  }

  @Post()
  createEstudiante(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudianeteService.create(createEstudianteDto);
  }
}
