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
import { MaritalStatusService } from '../services/marital-status.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  CreateMaritalStatusDto,
  UpdateMaritalStatusDto,
} from '../dto/marital-status.dto';

@Controller('marital-status')
export class MaritalStatusController {
  constructor(private readonly maritalStatusService: MaritalStatusService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.maritalStatusService.findAll(paginationDto);
  }

  @Post()
  create(@Body() createMaritalStatusDto: CreateMaritalStatusDto) {
    return this.maritalStatusService.create(createMaritalStatusDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.maritalStatusService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateMaritalStatusDto: UpdateMaritalStatusDto,
  ) {
    return this.maritalStatusService.update(id, updateMaritalStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.maritalStatusService.remove(id);
  }
}
