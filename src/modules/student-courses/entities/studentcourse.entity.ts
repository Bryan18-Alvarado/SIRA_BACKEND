import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StudentCourse {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  student_courses_id: number;

  @Column({ type: 'int4' })
  student_id: number;

  @Column({ type: 'int4' })
  id_courses: number;

  @Column({ type: 'date' })
  enrollment_date: Date;

  @Column({ type: 'float' })
  grade: number;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
