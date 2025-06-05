import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from './entities/tutor.entity';
import { TutoresService } from './services/tutores.service';
import { TutoresController } from './controllers/tutores.controller';
import { Genders } from '../genders/entities/genders.entity';
import { MaritalStatus } from '../marital-status/entities/marital-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tutor, Genders, MaritalStatus])],
  controllers: [TutoresController],
  providers: [TutoresService],
  exports: [TypeOrmModule], // <- Esto es esencial para que otros módulos puedan usar el repositorio
})
export class TutoresModule {}
