import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from 'src/modules/estudiantes/entities/estudiante.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { Injectable } from '@nestjs/common';
import { StudentCourse } from 'src/modules/student-courses/entities/studentcourse.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly studentRepository: Repository<Estudiante>,
    @InjectRepository(StudentCourse)
    private readonly studentCourseRepository: Repository<StudentCourse>,
  ) {}
  // Generar el reporte de estudiantes

  async generateStudentsReport(res: Response): Promise<void> {
    const students = await this.studentRepository.find({
      relations: [
        'studentCourses',
        'calificaciones',
        'calificaciones.course',
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
      { header: 'Nota', key: 'calificacion', width: 10 },
      { header: 'Docente', key: 'docente', width: 25 },
      { header: 'Nivel', key: 'nivel', width: 20 },
      { header: 'Categoría', key: 'categoria', width: 15 },
    ];

    // agregar los datos de los estudiantes
    students.forEach((student) => {
      student.studentCourses.forEach((studentCourse) => {
        const curso = studentCourse.courses; // El curso real está aquí

        const calificacion = student.calificaciones.find(
          (calif) => calif.course.id === curso.id, // Ahora sí compara correctamente
        );

        worksheet.addRow({
          id: student.id,
          nombre: `${student.nombre} ${student.apellido}`,
          curso: curso?.nombre || '',
          calificacion: calificacion?.grade ?? '',
          docente: curso?.docentes?.nombre || '',
          nivel: curso?.level?.level_course || '',
          categoria: curso?.categories?.nombre || '',
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

  async generateStudentsCourseByReport(
    res: Response,
    CoursesId: number,
  ): Promise<void> {
    const studentCourses = await this.studentCourseRepository.find({
      where: { courses: { id: CoursesId } },
      relations: ['estudiante', 'courses'],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Estudiantes por Curso');

    worksheet.columns = [
      { header: 'ID Estudiante', key: 'idEstudiante', width: 15 },
      { header: 'Nombre Estudiante', key: 'nombreEstudiante', width: 30 },
      { header: 'Curso', key: 'curso', width: 25 },
      { header: 'Fecha de Inscripción', key: 'fecha', width: 20 },
    ];

    studentCourses.forEach((stc) => {
      const enrollmentDate = new Date(stc.enrollmentDate);
      worksheet.addRow({
        idEstudiante: stc.estudiante?.id,
        nombreEstudiante: `${stc.estudiante?.nombre} ${stc.estudiante?.apellido}`,
        curso: stc.courses?.nombre || '',
        fecha: enrollmentDate.toLocaleDateString(),
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=estudiantes_por_curso.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
