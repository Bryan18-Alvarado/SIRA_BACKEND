import { Module } from '@nestjs/common';
import { EstudiantesModule } from '../estudiantes/estudiantes.module';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './service/report.service';

@Module({
  imports: [EstudiantesModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
