// src/modules/tutores/entities/tutor.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Estudiante } from '../../estudiantes/entities/estudiante.entity';
import { Genders } from 'src/modules/genders/entities/genders.entity';
import { MaritalStatus } from 'src/modules/marital-status/entities/marital-status.entity';

@Entity()
export class Tutor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @Column({ type: 'int4', nullable: false })
  estado_civil_id: number;

  @Column({ type: 'int4', nullable: false })
  genero_id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  correoElectronico?: string;

  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @ManyToOne(() => Genders)
  @JoinColumn({ name: 'genero_id', referencedColumnName: 'id' })
  genero: Genders;

  @OneToMany(() => Estudiante, (estudiante) => estudiante.tutor)
  estudiantes: Estudiante[];

  @ManyToOne(() => MaritalStatus)
  @JoinColumn({ name: 'estado_civil_id', referencedColumnName: 'id' })
  estado_civil: MaritalStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
