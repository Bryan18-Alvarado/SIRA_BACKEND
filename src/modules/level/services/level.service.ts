import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from '../entities/level.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CreateLevelDto, UpdateLevelDto } from '../dto/level.dto';

@Injectable()
export class LevelService {
  private readonly logger = new Logger('LevelService');

  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const [data, total] = await this.levelRepository.findAndCount({
      take: paginationDto.limit,
      skip: paginationDto.offset,
    });
    return { data, total };
  }

  async create(createLevelDto: CreateLevelDto) {
    try {
      const level = this.levelRepository.create(createLevelDto);
      await this.levelRepository.save(level);

      return level;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, updateLevelDto: UpdateLevelDto) {
    const level = await this.levelRepository.findOne({ where: { id } });

    if (!level) {
      throw new NotFoundException(`Level with id ${id} not found`);
    }
    try {
      this.levelRepository.merge(level, updateLevelDto);
      await this.levelRepository.save(level);
      return {
        message: 'Record updated successfully',
        data: level,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exists = await this.levelRepository.existsBy({ id });

    if (!exists) {
      throw new NotFoundException(`Nivel con id ${id} no encontrado`);
    }
    await this.levelRepository.softDelete({ id });
    return {
      message: `Nivel con id ${id} eliminado exitosamente`,
      deleteAt: new Date(),
    };
  }

  async deleteAllLevels() {
    const query = this.levelRepository.createQueryBuilder('level');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(id: number) {
    const level = await this.levelRepository.findOneBy({ id });

    if (!level) {
      throw new NotFoundException(`Level with id ${id} not found`);
    }
    return level;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
  }
}
