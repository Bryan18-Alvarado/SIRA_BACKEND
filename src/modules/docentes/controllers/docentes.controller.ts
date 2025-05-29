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
import { DocentesService } from '../services/docentes.service';
import {
  CreateDocenteDto,
  FilterDocenteDto,
  UpdateDocenteDto,
} from '../dto/docente-create.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  @Get()
  async getFindAll(@Query() params: FilterDocenteDto) {
    const [rows, total] = await this.docentesService.findAll(params);
    return { data: rows, total };
  }

  @Post()
  @Auth(ValidRoles.admin)
  async createDocente(
    @Body() createDocenteDto: CreateDocenteDto,
    @GetUser() user: User,
  ) {
    const nuevo = await this.docentesService.create(createDocenteDto, user);
    const data = {
      data: nuevo,
      message: 'Docente creado correctamente',
    };
    return data;
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const rows = await this.docentesService.findOne(id);
    const data = {
      data: rows,
    };
    return data;
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  async update(
    @Param('id') id: number,
    @Body() updateDocenteDto: UpdateDocenteDto,
    @GetUser() user: User,
  ) {
    const rows = await this.docentesService.update(id, updateDocenteDto, user);
    const data = {
      data: rows,
      message: 'Docente actualizado correctamente',
    };
    return data;
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id') id: number) {
    const dato = await this.docentesService.remove(id);
    const data = {
      data: dato,
      message: 'Docente eliminado correctamente',
    };
    return data;
  }
}
