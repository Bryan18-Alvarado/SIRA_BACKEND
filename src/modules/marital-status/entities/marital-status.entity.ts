import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MaritalStatus {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id?: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  marital_status: string;
}
