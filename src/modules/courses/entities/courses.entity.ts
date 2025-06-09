import { Categories } from 'src/modules/categories/entities/categories.entity';
import { Level } from 'src/modules/level/entities/level.entity';
import { Docente } from 'src/modules/docentes/entities/docentes.entity';
import { StudentCourse } from 'src/modules/student-courses/entities/studentcourse.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Courses {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  @Column({ type: 'int4', nullable: false })
  categories_id: number;

  @Column({ type: 'int4', nullable: false })
  level_id: number;

  @Column({ type: 'int4', nullable: true })
  docentes_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ type: 'varchar', length: 100 })
  duracion: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  horario: string;

  @Column({ type: 'date' })
  fecha_inicio: string;

  @Column({ type: 'date' })
  fecha_fin: string;

  @Column({ type: 'int' })
  cupos_disponibles: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'varchar', length: 100 })
  requisitos: string;

  @Column({ type: 'int' })
  precio: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteAt: Date;

  // Relaciones

  @ManyToOne(() => Categories)
  @JoinColumn({ name: 'categories_id', referencedColumnName: 'id' })
  categories: Categories;

  @ManyToOne(() => Level)
  @JoinColumn({ name: 'level_id', referencedColumnName: 'id' })
  level: Level;

  @ManyToOne(() => Docente, (docente) => docente.courses)
  @JoinColumn({ name: 'docentes_id', referencedColumnName: 'id' })
  docentes: Docente;

  @OneToMany(() => StudentCourse, (studentCourse) => studentCourse.courses)
  studentCourses: StudentCourse[];
}
