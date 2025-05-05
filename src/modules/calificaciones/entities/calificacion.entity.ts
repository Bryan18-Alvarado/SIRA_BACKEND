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

import { Courses } from '../../courses/entities/courses.entity';
import { Estudiante } from '../../estudiantes/entities/estudiante.entity';
@Entity()
export class Calificacion {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  gradesId: number;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.calificaciones) // Relación con Estudiante
  @JoinColumn({ name: 'studentId' }) // Utiliza la clave foránea 'studentId'
  estudiante: Estudiante;

  @ManyToOne(() => Courses)
  @JoinColumn({ name: 'courseId' })
  course: Courses;

  @Column({ type: 'float' })
  grade: number;

  @Column({ type: 'date' })
  gradeDate: Date;

  @Column({ type: 'varchar', length: 50 })
  gradeType: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteAt: Date;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
