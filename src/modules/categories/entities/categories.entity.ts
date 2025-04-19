import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteAt: Date;
}
