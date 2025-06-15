import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { StudentCourse } from '../../student-courses/entities/studentcourse.entity';
import { Calificacion } from '../../calificaciones/entities/calificacion.entity';
import { Genders } from 'src/modules/genders/entities/genders.entity';
import { Tutor } from 'src/modules/tutores/entities/tutor.entity';
import { User } from 'src/auth/entities/user.entity';
import { Courses } from 'src/modules/courses/entities/courses.entity';
import { StudentCourse } from 'src/modules/student-courses/entities/studentcourse.entity';

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

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'int', nullable: true })
  tutor_id?: number;

  @OneToOne(() => User, (user) => user.estudiante, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

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

  @OneToMany(() => StudentCourse, (studentCourses) => studentCourses.estudiante)
  studentCourses: StudentCourse[];

  // @ManyToMany(() => Courses, (curso) => curso.estudiantes, { cascade: true })
  // @JoinTable({
  //   name: 'student_courses', // Nombre de la tabla pivote
  //   joinColumn: { name: 'estudiante_id' },
  //   inverseJoinColumn: { name: 'curso_id' },
  // })
  // cursos: Courses[];
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteAt: Date;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
