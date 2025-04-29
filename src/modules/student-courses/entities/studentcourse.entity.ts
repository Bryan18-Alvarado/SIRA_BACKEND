import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Estudiante } from 'src/modules/estudiantes/entities/estudiante.entity';
import { Courses } from 'src/modules/courses/entities/courses.entity';
import { Calificacion } from 'src/modules/calificaciones/entities/calificacion.entity';
@Entity()
export class StudentCourse {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  studentcoursesId: number;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.studentCourses)
  @JoinColumn({ name: 'estudianteId' })
  estudiante: Estudiante;

  @ManyToOne(() => Courses, (courses) => courses.studentCourses)
  @JoinColumn({ name: 'coursesId' }) // La columna 'coursesId' es la clave foránea que apunta a 'Courses'
  courses: Courses;

  @Column({ type: 'date' })
  enrollmentDate: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteAt: Date;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
