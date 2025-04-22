import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from './entities/courses.entity';
import { CoursesController } from './controllers/courses.controller';
import { CoursesService } from './services/courses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Courses])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [TypeOrmModule, CoursesService],
})
export class CoursesModule {}
