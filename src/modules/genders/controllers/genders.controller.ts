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
import { GendersService } from '../services/genders.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateGendersDto, UpdateGendersDto } from '../dto/genders.dto';

@Controller('genders')
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.gendersService.findAll(paginationDto);
  }

  @Post()
  createGenders(@Body() createGendersDto: CreateGendersDto) {
    return this.gendersService.create(createGendersDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.gendersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateGendersDto: UpdateGendersDto) {
    return this.gendersService.update(id, updateGendersDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.gendersService.remove(id);
  }
}
