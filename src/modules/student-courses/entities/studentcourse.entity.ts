import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteAt: Date;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
