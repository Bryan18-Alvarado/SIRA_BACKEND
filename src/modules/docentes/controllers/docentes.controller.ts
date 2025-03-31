import { Body, Controller, Get, Post } from '@nestjs/common';
import { DocentesService } from '../services/docentes.service';
import { createDocenteDto } from '../dto/docente-create.dto';

@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  @Get()
  getDocentesAll() {
    return 'Todos los docentes';
  }

  @Post()
  createDocente(@Body() createDocenteDto: createDocenteDto) {
    return this.docentesService.createDocente(createDocenteDto);
  }
}
