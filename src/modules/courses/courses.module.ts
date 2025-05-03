import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from './entities/courses.entity';
import { CoursesController } from './controllers/courses.controller';
import { CoursesService } from './services/courses.service';
import { Categories } from '../categories/entities/categories.entity';
import { LevelModule } from '../level/level.module';
import { Level } from '../level/entities/level.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Courses, Categories, Level]),
    LevelModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [TypeOrmModule, CoursesService],
})
export class CoursesModule {}
