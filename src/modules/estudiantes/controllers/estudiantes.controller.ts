import { EstudiantesService } from '../services/estudiantes.service';
import {
  CreateEstudianteDto,
  UpdateEstudianteDto,
} from '../dto/estudiantes.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
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

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudianteService: EstudiantesService) {}
  @Get()
  getEstudiantesAll(@Query() paginationDto: PaginationDto): Promise<any> {
    return this.estudianteService.findAll(paginationDto);
  }

  @Post()
  createEstudiante(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudianteService.create(createEstudianteDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.estudianteService.findOne(id);
  }

  @Get(':id/calificacion')
  async findCalificacionesByEstudiante(@Param('id') id: number) {
    return await this.estudianteService.findCalificacionesByEstudiante(id);
  }

  @Put(':id')
  updaate(
    @Param('id') id: number,
    @Body() updateEstudianteDto: UpdateEstudianteDto, // O puedes crear un UpdateEstudianteDto
  ) {
    return this.estudianteService.update(id, updateEstudianteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.estudianteService.remove(id);
  }
}
