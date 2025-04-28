import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Estudiante } from 'src/modules/estudiantes/entities/estudiante.entity';
import { Courses } from 'src/modules/courses/entities/courses.entity';
@Entity()
export class StudentCourse {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  studentcoursesId: number;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.studentCourses)
  @JoinColumn({ name: 'estudianteId' })
  estudiante: Estudiante;

  @ManyToOne(() => Courses, (courses) => courses.studentCourse)
  @JoinColumn({ name: 'coursesId' }) // La columna 'coursesId' es la clave foránea que apunta a 'Courses'
  courses: Courses;

  @Column({ type: 'date' })
  enrollmentDate: Date;

  @Column({ type: 'float' })
  grade: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteAt: Date;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
