import { Module } from '@nestjs/common';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './service/report.service';
import { Estudiante } from '../estudiantes/entities/estudiante.entity';
import { StudentCourse } from '../student-courses/entities/studentcourse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Aquí registras las entidades cuyos repositorios vas a inyectar
    TypeOrmModule.forFeature([Estudiante, StudentCourse]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
