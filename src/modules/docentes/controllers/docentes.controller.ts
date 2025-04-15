import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DocentesService } from '../services/docentes.service';
import { createDocenteDto } from '../dto/docente-create.dto';

@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  @Get()
  findAll() {
    return this.docentesService.findAll();
  }

  @Post()
  createDocente(@Body() createDocenteDto: createDocenteDto) {
    return this.docentesService.create(createDocenteDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.docentesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param(':id') id: number) {
    return this.docentesService.remove(id);
  }
}
