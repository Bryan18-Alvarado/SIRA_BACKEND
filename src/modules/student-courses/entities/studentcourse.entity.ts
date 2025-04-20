import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StudentCourse {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  studentcourseId: number;

  @Column({ type: 'int4' })
  studentId: number;

  @Column({ type: 'int4' })
  coursesId: number;

  @Column({ type: 'date' })
  enrollmentDate: Date;

  @Column({ type: 'float' })
  grade: number;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
