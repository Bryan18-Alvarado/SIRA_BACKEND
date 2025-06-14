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

  @Column()
  studentId: number;

  @Column()
  coursesId: number;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'studentId', referencedColumnName: 'id' }) // La columna 'estudianteId' es la clave foránea que apunta a 'Estudiante'
  estudiante: Estudiante;

  @ManyToOne(() => Courses)
  @JoinColumn({ name: 'coursesId', referencedColumnName: 'id' }) // La columna 'coursesId' es la clave foránea que apunta a 'Courses'
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
