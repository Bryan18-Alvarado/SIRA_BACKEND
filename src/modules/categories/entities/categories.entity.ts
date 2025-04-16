import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @Column({ type: 'bool', default: true })
  status: boolean;

  // @CreateDateColumn({ type: 'timestamp' })
  // created_at: Date;

  // @UpdateDateColumn({ type: 'timestamp' })
  // updated_at: Date;
}
