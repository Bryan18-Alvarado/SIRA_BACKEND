import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Calificacion {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  gradesId: number;

  @Column({ type: 'int4' })
  studentcoursesId: number;

  @Column({ type: 'float' })
  grade: number;

  @Column({ type: 'date' })
  gradeDate: Date;

  @Column({ type: 'varchar', length: 50 })
  gradeType: string;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
