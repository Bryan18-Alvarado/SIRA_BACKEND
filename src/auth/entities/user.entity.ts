import { Docente } from 'src/modules/docentes/entities/docentes.entity';
import { Estudiante } from 'src/modules/estudiantes/entities/estudiante.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password?: string;

  @Column('text')
  userName: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @OneToOne(() => Docente, (docente) => docente.user)
  docente: Docente;

  @OneToOne(() => Estudiante, (estudiante) => estudiante.user)
  estudiante: Estudiante;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
