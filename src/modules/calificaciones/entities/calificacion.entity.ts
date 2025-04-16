import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Calificacion {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  grades_id: number;

  @Column({ type: 'int4' })
  student_courses_id: number;

  @Column({ type: 'float' })
  grade_value: number;

  @Column({ type: 'date' })
  grade_date: Date;

  @Column({ type: 'varchar', length: 50 })
  grade_type: string;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
