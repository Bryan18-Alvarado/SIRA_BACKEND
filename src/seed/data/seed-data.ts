import {
  EstadoCivil,
  Genero,
} from 'src/modules/docentes/entities/docentes.entity';

interface SeedEstudiante {
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  telefono: string;
  correoElectronico: string;
  direccion: string;
}

interface SeedCalificacion {
  studentId: number;
  courseId: number;
  grade: number;
  gradeDate: Date;
  gradeType: string;
  isAvailable: boolean;
}

interface SeedCourse {
  categories_id: number;
  docentes_id: number;
  level_id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  horario: string;
  fecha_inicio: string;
  fecha_fin: string;
  cupos_disponibles: number;
  status: boolean;
  requisitos: string;
  precio: number;
  isAvailable: boolean;
}

interface SeedStudentCourse {
  studentId: number;
  coursesId: number;
  enrollmentDate: Date;
  isAvailable: boolean;
}

export interface SeedDocente {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  genero: Genero;
  codigo_laboral: number;
  cursos_asignados: string;
  direccion?: string;
  fecha_ingreso: Date;
  fecha_nacimiento: Date;
  telefono?: string;
  email?: string;
  estado_civil: EstadoCivil;
  isAvailable: boolean;
  createdAt: Date;
  updateAt?: Date;
  deleteAt?: Date;
}

interface Seedcategories {
  nombre: string;
  descripcion: string;
  status: boolean;
  createdAt: Date;
  updateAt?: Date;
  deleteAt?: Date;
  isAvailable: boolean;
}

interface SeedLevel {
  id?: number;
  level_course: string;
}

interface SeedData {
  estudiantes: SeedEstudiante[];
  calificaciones: SeedCalificacion[];
  courses: SeedCourse[];
  studentCourses: SeedStudentCourse[];
  docentes: SeedDocente[];
  categories: Seedcategories[];
  levels: SeedLevel[];
}

export const initialData: SeedData = {
  estudiantes: [
    {
      nombre: 'Juan',
      apellido: 'Pérez',
      fechaNacimiento: new Date(2000, 4, 10),
      telefono: '555-1234',
      correoElectronico: 'juan.perez@example.com',
      direccion: 'Calle Falsa 123',
    },
    {
      nombre: 'Ana',
      apellido: 'García',
      fechaNacimiento: new Date(2008, 8, 22),
      telefono: '555-5678',
      correoElectronico: 'ana.garcia@example.com',
      direccion: 'Av. Siempre Viva 742',
    },
  ],
  levels: [
    {
      id: 1,
      level_course: 'A1 - Principiante',
    },
    {
      id: 2,
      level_course: 'C1 - Avanzado',
    },
    {
      id: 3,
      level_course: 'Nivel Básico de Computación',
    },
  ],

  courses: [
    {
      categories_id: 1,
      docentes_id: 1,
      level_id: 1,
      codigo: 'ENG-A1',
      nombre: 'Inglés A1',
      descripcion: 'Nivel introductorio de inglés',
      duracion: '3 meses',
      horario: 'Lunes y Miércoles 10:00 - 12:00',
      fecha_inicio: '2025-06-01',
      fecha_fin: '2025-09-01',
      cupos_disponibles: 20,
      status: true,
      requisitos: 'Ninguno',
      precio: 200,
      isAvailable: true,
    },
    {
      categories_id: 1,
      docentes_id: 2,
      level_id: 2,
      codigo: 'ENG-C1',
      nombre: 'Inglés C1',
      descripcion: 'Nivel avanzado de inglés',
      duracion: '3 meses',
      horario: 'Martes y Jueves 14:00 - 16:00',
      fecha_inicio: '2025-06-01',
      fecha_fin: '2025-09-01',
      cupos_disponibles: 15,
      status: true,
      requisitos: 'Nivel B2 aprobado',
      precio: 250,
      isAvailable: true,
    },
    {
      categories_id: 2,
      docentes_id: 3,
      level_id: 1,
      codigo: 'COMP-101',
      nombre: 'Computación Básica',
      descripcion: 'Fundamentos de informática',
      duracion: '2 meses',
      horario: 'Sábados 09:00 - 12:00',
      fecha_inicio: '2025-06-15',
      fecha_fin: '2025-08-15',
      cupos_disponibles: 25,
      status: true,
      requisitos: 'Ninguno',
      precio: 150,
      isAvailable: true,
    },
  ],

  studentCourses: [
    {
      studentId: 1,
      coursesId: 1,
      isAvailable: true,
      enrollmentDate: new Date(2025, 5, 1),
    },
    {
      studentId: 1,
      coursesId: 3,
      isAvailable: true,
      enrollmentDate: new Date(2025, 6, 15),
    },
    {
      studentId: 2,
      coursesId: 1,
      isAvailable: true,
      enrollmentDate: new Date(2025, 5, 1),
    },
  ],

  calificaciones: [
    {
      studentId: 1,
      courseId: 1,
      grade: 8.5,
      gradeDate: new Date(2025, 7, 15),
      gradeType: 'Examen Final',
      isAvailable: true,
    },
    {
      studentId: 1,
      courseId: 3,
      grade: 9.0,
      gradeDate: new Date(2025, 7, 30),
      gradeType: 'Proyecto',
      isAvailable: true,
    },
    {
      studentId: 2,
      courseId: 1,
      grade: 7.5,
      gradeDate: new Date(2025, 7, 10),
      gradeType: 'Evaluación Continua',
      isAvailable: true,
    },
  ],
  docentes: [
    {
      id: 1,
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      edad: 45,
      genero: Genero.MASCULINO,
      codigo_laboral: 1234,
      cursos_asignados: 'Inglés A1',
      direccion: 'Calle Profesor 10',
      fecha_ingreso: new Date(2010, 3, 5),
      fecha_nacimiento: new Date(1980, 2, 15),
      telefono: '555-1010',
      email: 'carlos.rodriguez@academia.com',
      estado_civil: EstadoCivil.CASADO,
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'López',
      edad: 38,
      genero: Genero.FEMENINO,
      codigo_laboral: 5678,
      cursos_asignados: 'Inglés C1',
      direccion: 'Calle Profesora 5',
      fecha_ingreso: new Date(2015, 7, 12),
      fecha_nacimiento: new Date(1987, 5, 23),
      telefono: '555-2020',
      email: 'maria.lopez@academia.com',
      estado_civil: EstadoCivil.SOLTERO,
      isAvailable: true,
      createdAt: new Date(),
    },
    {
      id: 3,
      nombre: 'Juan',
      apellido: 'Sánchez',
      edad: 40,
      genero: Genero.MASCULINO,
      codigo_laboral: 91011,
      cursos_asignados: 'Computación Básica',
      direccion: 'Calle Informática 7',
      fecha_ingreso: new Date(2012, 1, 20),
      fecha_nacimiento: new Date(1985, 10, 3),
      telefono: '555-3030',
      email: 'juan.sanchez@academia.com',
      estado_civil: EstadoCivil.SOLTERO,
      isAvailable: true,
      createdAt: new Date(),
    },
  ],
  categories: [
    {
      nombre: 'Inglés',
      descripcion: 'Cursos de inglés para todos los niveles',
      status: true,
      createdAt: new Date(),
      isAvailable: true,
    },
    {
      nombre: 'Computación',
      descripcion: 'Fundamentos de computación y programación',
      status: true,
      createdAt: new Date(),
      isAvailable: true,
    },
  ],
};
