import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from 'src/modules/estudiantes/entities/estudiante.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly studentRepository: Repository<Estudiante>,
  ) {}

  async generateStudentsReport(res: Response): Promise<void> {
    const students = await this.studentRepository.find({
      relations: [
        'studentCourses',
        'studentCourses.courses',
        'studentCourses.courses.docentes',
        'studentCourses.courses.level',
        'studentCourses.courses.categories',
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Estudiantes');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Curso', key: 'curso', width: 25 },
      { header: 'Nota', key: 'nota', width: 10 },
      { header: 'Docente', key: 'docente', width: 25 },
      { header: 'Nivel', key: 'nivel', width: 10 },
      { header: 'Categoría', key: 'categoria', width: 15 },
    ];

    // agregar los datos de los estudiantes
    students.forEach((student) => {
      student.studentCourses.forEach((sc) => {
        worksheet.addRow({
          id: student.id,
          nombre: `${student.nombre} ${student.apellido}`,
          curso: sc.courses?.nombre || '',
          calificacion: student.calificaciones,
          docente: sc.courses?.docentes?.nombre || '',
          nivel: sc.courses?.level?.level_course || '',
          categoria: sc.courses?.categories?.nombre || '',
        });
      });
    });

    // configurar el encabezado para la descarga del archivo

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=estudiantes.xlsx',
    );

    // escribir el archivo en la respuesta
    await workbook.xlsx.write(res);
    res.end();
  }
}
