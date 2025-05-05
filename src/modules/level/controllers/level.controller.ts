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
import { LevelService } from '../services/level.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateLevelDto, UpdateLevelDto } from '../dto/level.dto';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.levelService.findAll(paginationDto);
  }

  @Post()
  createLevel(@Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(createLevelDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.levelService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelService.update(id, updateLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.levelService.remove(id);
  }
}
