import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EstadoCivil {
  SOLTERO = 'soltero',
  CASADO = 'casado',
}
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

  @Column({ type: 'int' })
  codigo_laboral: number;

  @Column({ type: 'varchar', length: 100 })
  cursos_asignados: string;

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

  @Column({
    type: 'enum',
    enum: EstadoCivil,
  })
  estado_civil: EstadoCivil;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteAt: Date;
}
