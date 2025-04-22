import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Courses {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

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

  @Column({ type: 'varchar', length: 100 })
  nivel: string;

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
}
