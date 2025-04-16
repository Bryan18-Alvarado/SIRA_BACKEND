import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoriesDto } from '../dto/categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  createCategories(@Body() createCategoriesDto: CreateCategoriesDto) {
    return this.categoriesService.create(createCategoriesDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param(':id') id: number) {
    return this.categoriesService.remove(id);
  }
}
