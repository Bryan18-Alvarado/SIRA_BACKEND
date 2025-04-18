import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'date' })
  fechaNacimiento: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  correoElectronico: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
