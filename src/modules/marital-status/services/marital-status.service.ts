import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaritalStatus } from '../entities/marital-status.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  CreateMaritalStatusDto,
  UpdateMaritalStatusDto,
} from '../dto/marital-status.dto';

@Injectable()
export class MaritalStatusService {
  private readonly logger = new Logger('MaritalStatusService');

  constructor(
    @InjectRepository(MaritalStatus)
    private readonly maritalStatusRepository: Repository<MaritalStatus>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const [data, total] = await this.maritalStatusRepository.findAndCount({
      take: paginationDto.limit,
      skip: paginationDto.offset,
    });
    return { data, total };
  }

  async create(createMaritalStatusDto: CreateMaritalStatusDto) {
    try {
      const MaritalStatus = this.maritalStatusRepository.create(
        createMaritalStatusDto,
      );
      await this.maritalStatusRepository.save(MaritalStatus);

      return MaritalStatus;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, updateMaritalStatusDto: UpdateMaritalStatusDto) {
    const maritalStatus = await this.maritalStatusRepository.findOne({
      where: { id },
    });

    if (!maritalStatus) {
      throw new NotFoundException(`Estado civil id ${id} no encontrado`);
    }
    try {
      this.maritalStatusRepository.merge(maritalStatus, updateMaritalStatusDto);
      await this.maritalStatusRepository.save(maritalStatus);
      return {
        message: 'Record updated successfully',
        data: maritalStatus,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exists = await this.maritalStatusRepository.existsBy({ id });

    if (!exists) {
      throw new NotFoundException(`Estado civil con id ${id} no encontrado`);
    }
    await this.maritalStatusRepository.softDelete(id);
    return {
      message: `Registro con id ${id} eliminado correctamente`,
      deleteAt: new Date(),
    };
  }

  async findOne(id: number) {
    const maritalStatus = await this.maritalStatusRepository.findOneBy({ id });

    if (!maritalStatus) {
      throw new NotFoundException(`Estado civil con id ${id} no encontrado`);
    }
    return maritalStatus;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
  }
}
