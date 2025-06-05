import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentCourse } from '../../student-courses/entities/studentcourse.entity';
import { Calificacion } from '../../calificaciones/entities/calificacion.entity';
import { Genders } from 'src/modules/genders/entities/genders.entity';
import { Tutor } from 'src/modules/tutores/entities/tutor.entity';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  codigoEstudiante: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'date' })
  fechaNacimiento: Date;

  @Column({ type: 'int4', nullable: false })
  genero_id: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  correoElectronico: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ type: 'int', nullable: true })
  tutor_id?: number;

  @ManyToOne(() => Tutor, (tutor) => tutor.estudiantes, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'tutor_id' })
  tutor?: Tutor;

  @ManyToOne(() => Genders)
  @JoinColumn({ name: 'genero_id', referencedColumnName: 'id' })
  genero: Genders;

  @OneToMany(() => Calificacion, (calificacion) => calificacion.estudiante)
  calificaciones: Calificacion[];

  @OneToMany(() => StudentCourse, (studentCourse) => studentCourse.estudiante)
  studentCourses: StudentCourse[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteAt: Date;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
