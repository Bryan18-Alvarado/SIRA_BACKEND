// src/modules/tutores/controllers/tutors.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateTutorDto,
  FilterTutorDto,
  UpdateTutorDto,
} from '../dto/tutor.dto';
import { TutoresService } from '../services/tutores.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('tutores')
export class TutoresController {
  constructor(private readonly tutorsService: TutoresService) {}

  @Get()
  async findAll(@Query() params?: FilterTutorDto) {
    return this.tutorsService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tutorsService.findOne(id);
  }

  @Post()
  async create(@Body() createTutorDto: CreateTutorDto) {
    return this.tutorsService.create(createTutorDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTutorDto: UpdateTutorDto,
  ) {
    return this.tutorsService.update(id, updateTutorDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tutorsService.remove(id);
  }
}
