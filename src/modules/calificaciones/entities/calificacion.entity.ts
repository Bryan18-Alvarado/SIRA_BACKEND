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
import { StudentCourse } from 'src/modules/student-courses/entities/studentcourse.entity';
@Entity()
export class Calificacion {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  gradesId: number;

  @ManyToOne(() => StudentCourse, (studentCourse) => studentCourse.grade)
  @JoinColumn({ name: 'studentcoursesId' })
  studentCourse: StudentCourse;

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
