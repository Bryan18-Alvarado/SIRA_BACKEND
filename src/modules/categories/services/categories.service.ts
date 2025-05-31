import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../entities/categories.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  CreateCategoriesDto,
  UpdateCategoriesDto,
} from '../dto/categories.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const [data, total] = await this.categoriesRepository.findAndCount({
      take: paginationDto.limit,
      skip: paginationDto.offset,
    });
    return { data, total };
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

  async update(id: number, updateCategoriesDto: UpdateCategoriesDto) {
    const categories = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (!categories) {
      throw new NotFoundException(`categoria con id ${id} no encontrado`);
    }
    try {
      this.categoriesRepository.merge(categories, updateCategoriesDto);
      await this.categoriesRepository.save(categories);
      return {
        message: 'registro actualizado con exito',
        data: categories,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async deleteAllCategories() {
    const query = this.categoriesRepository.createQueryBuilder('categories');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exists = await this.categoriesRepository.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(`categoria con id ${id} no encontrada`);
    }
    await this.categoriesRepository.softDelete({ id });
    return {
      message: `Categoria con ${id} eliminado con exito`,
      deleteAt: new Date(),
    };
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
