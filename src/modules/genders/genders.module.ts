import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genders } from './entities/genders.entity';
import { GendersController } from './controllers/genders.controller';
import { GendersService } from './services/genders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Genders])],
  controllers: [GendersController],
  providers: [GendersService],
  exports: [TypeOrmModule, GendersService],
})
export class GendersModule {}
