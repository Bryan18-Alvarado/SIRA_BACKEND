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
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.docentesService.findAll(paginationDto);
  }

  @Post()
  @Auth(ValidRoles.admin)
  createDocente(
    @Body() createDocenteDto: CreateDocenteDto,
    @GetUser() user: User,
  ) {
    return this.docentesService.create(createDocenteDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.docentesService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id') id: number,
    @Body() updateDocenteDto: UpdateDocenteDto,
    @GetUser() user: User,
  ) {
    return this.docentesService.update(id, updateDocenteDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: number) {
    return this.docentesService.remove(id);
  }
}
