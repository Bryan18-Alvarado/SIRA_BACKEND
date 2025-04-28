import { Categories } from 'src/modules/categories/entities/categories.entity';
import { Docente } from 'src/modules/docentes/entities/docentes.entity';
import { StudentCourse } from 'src/modules/student-courses/entities/studentcourse.entity';
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

@Entity()
export class Courses {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  @Column({ type: 'int4', nullable: false })
  categories_id: number;

  @Column({ type: 'int4', nullable: false })
  docentes_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ type: 'varchar', length: 100 })
  duracion: string;

  //CATEGORIA

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

  @ManyToOne(() => Categories)
  @JoinColumn({ name: 'categories_id', referencedColumnName: 'id' })
  categories: Categories;

  @ManyToOne(() => Docente)
  @JoinColumn({ name: 'docentes_id', referencedColumnName: 'id' })
  docentes: Docente;

  @ManyToOne(() => StudentCourse)
  @JoinColumn({
    name: 'studentcoursesId',
    referencedColumnName: 'studentcoursesId',
  })
  studentCourse: StudentCourse;

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
}
