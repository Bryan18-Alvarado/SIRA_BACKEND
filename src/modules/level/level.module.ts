import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { LevelController } from './controllers/level.controller';
import { LevelService } from './services/level.service';

@Module({
  imports: [TypeOrmModule.forFeature([Level])],
  controllers: [LevelController],
  providers: [LevelService],
  exports: [TypeOrmModule, LevelService],
})
export class LevelModule {}
