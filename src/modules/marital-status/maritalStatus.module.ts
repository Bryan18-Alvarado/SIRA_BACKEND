import { Module } from '@nestjs/common';
import { MaritalStatus } from './entities/marital-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaritalStatusController } from './controllers/marital-status.controller';
import { MaritalStatusService } from './services/marital-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([MaritalStatus])],
  controllers: [MaritalStatusController],
  providers: [MaritalStatusService],
  exports: [TypeOrmModule, MaritalStatusService],
})
export class MaritalStatusModule {}
