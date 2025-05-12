import { Controller, Get, Res } from '@nestjs/common';
import { ReportService } from '../service/report.service';
import { Response } from 'express';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @Get('excel/students')
  async getStudentsReport(@Res() res: Response): Promise<void> {
    await this.reportService.generateStudentsReport(res);
  }
}
