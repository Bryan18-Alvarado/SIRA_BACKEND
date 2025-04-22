import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteAt: Date;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
