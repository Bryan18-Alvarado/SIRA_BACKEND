import { Module } from '@nestjs/common';

import { DocentesController } from './controllers/docentes.controller';
import { Docente } from './entities/docentes.entity';
import { DocentesService } from './services/docentes.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Docente])],
  controllers: [DocentesController],
  providers: [DocentesService],
  exports: [TypeOrmModule, DocentesService],
})
export class DocentesModule {}
