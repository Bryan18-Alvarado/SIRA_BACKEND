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
import { DocentesService } from '../services/docentes.service';
import { CreateDocenteDto, UpdateDocenteDto } from '../dto/docente-create.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.docentesService.findAll(paginationDto);
  }

  @Post()
  createDocente(@Body() createDocenteDto: CreateDocenteDto) {
    return this.docentesService.create(createDocenteDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.docentesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDocenteDto: UpdateDocenteDto) {
    return this.docentesService.update(id, updateDocenteDto);
  }

  @Delete(':id')
  remove(@Param(':id') id: number) {
    return this.docentesService.remove(id);
  }
}
