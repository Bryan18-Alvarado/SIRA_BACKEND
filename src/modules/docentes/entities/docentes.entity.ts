import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'bool', default: true })
  estado: boolean;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;
}
export default Docente;
