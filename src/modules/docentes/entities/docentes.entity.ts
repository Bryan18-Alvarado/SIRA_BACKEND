import { User } from 'src/auth/entities/user.entity';
import { Genders } from 'src/modules/genders/entities/genders.entity';
import { MaritalStatus } from 'src/modules/marital-status/entities/marital-status.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Courses } from 'src/modules/courses/entities/courses.entity';

@Entity()
export class Docente {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'int' })
  edad: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'int4', nullable: false })
  genero_id: number;

  @Column({ type: 'int4', nullable: false })
  estado_civil_id: number;

  @Column({ type: 'varchar', unique: true })
  codigo_laboral: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ type: 'date' })
  fecha_ingreso: Date;

  @Column({ type: 'date' })
  fecha_nacimiento: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  email: string;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;

  @ManyToOne(() => User, (user) => user.docente, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Genders)
  @JoinColumn({ name: 'genero_id', referencedColumnName: 'id' })
  genero: Genders;

  @OneToOne(() => MaritalStatus)
  @JoinColumn({ name: 'estado_civil_id', referencedColumnName: 'id' })
  estado_civil: MaritalStatus;

  @OneToMany(() => Courses, (course) => course.docentes)
  courses: Courses[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteAt: Date;
}
