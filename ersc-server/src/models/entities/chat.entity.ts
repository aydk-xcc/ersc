import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('models')
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;
  
  @Column()
  userId: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}