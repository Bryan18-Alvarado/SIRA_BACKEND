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
import { CategoriesService } from '../services/categories.service';
import {
  CreateCategoriesDto,
  UpdateCategoriesDto,
} from '../dto/categories.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  @Post()
  createCategories(@Body() createCategoriesDto: CreateCategoriesDto) {
    return this.categoriesService.create(createCategoriesDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCategoriesDto: UpdateCategoriesDto,
  ) {
    return this.categoriesService.update(id, updateCategoriesDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoriesService.remove(id);
  }
}
