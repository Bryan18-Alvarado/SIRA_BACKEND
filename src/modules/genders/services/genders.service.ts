import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genders } from '../entities/genders.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CreateGendersDto, UpdateGendersDto } from '../dto/genders.dto';

@Injectable()
export class GendersService {
  private readonly logger = new Logger('GendersService');

  constructor(
    @InjectRepository(Genders)
    private readonly gendersRepository: Repository<Genders>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const [data, total] = await this.gendersRepository.findAndCount({
      take: paginationDto.limit,
      skip: paginationDto.offset,
    });
    return { data, total };
  }

  async create(createGendersDto: CreateGendersDto) {
    try {
      const genders = this.gendersRepository.create(createGendersDto);
      await this.gendersRepository.save(genders);
      return genders;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(id: number) {
    const genders = await this.gendersRepository.findOneBy({ id });

    if (!genders) {
      throw new NotFoundException(`Genero con id ${id} no encontrado`);
    }
    return genders;
  }

  async update(id: number, updateGendersDto: UpdateGendersDto) {
    const genders = await this.gendersRepository.findOne({ where: { id } });

    if (!genders) {
      throw new NotFoundException(`Genero con id ${id} no encontrado`);
    }
    try {
      this.gendersRepository.merge(genders, updateGendersDto);
      await this.gendersRepository.save(genders);
      return {
        message: 'Registro actualizado correctamente',
        data: genders,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exists = await this.gendersRepository.existsBy({ id });

    if (!exists) {
      throw new NotFoundException(`Genero con id ${id} no encontrado`);
    }
    await this.gendersRepository.softDelete({ id });
    return {
      message: `Genero con id ${id} eliminado exitosamente`,
      deleteAt: new Date(),
    };
  }

  async deleteAllGenders() {
    const query = this.gendersRepository.createQueryBuilder('genders');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
  }
}
