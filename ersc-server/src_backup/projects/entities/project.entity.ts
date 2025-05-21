import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  version: string;

  @Column({ nullable: true })
  entry: string;

  @Column({ default: 0 })
  all_rows: number;

  @Column({ default: 0 })
  read_rows: number;

  @Column({ nullable: true })
  base_dir: string;
  
  @Column({ default: 1 })
  user_id: number;

  @CreateDateColumn({ type: 'bigint' })
  createdAt: number;

  @UpdateDateColumn({ type: 'bigint' })
  updatedAt: number;
} 