import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoriesDto } from '../dto/categories.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  findAll() {
    return this.categoriesRepository.find({});
  }

  async create(createCategoriesDto: CreateCategoriesDto) {
    try {
      const categories = this.categoriesRepository.create(createCategoriesDto);
      await this.categoriesRepository.save(categories);

      return categories;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const categories = await this.findOne(id);
    await this.categoriesRepository.remove(categories);
  }

  async findOne(id: number) {
    const categories = await this.categoriesRepository.findOneBy({ id });
    if (!categories) {
      throw new NotFoundException(`categoria con id ${id} no fue encontrada`);
    }
    return categories;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
  }
}
