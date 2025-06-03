import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  model: string;

  @Column({ type: 'text' })
  messages: string;

  @Column()
  sessionId: string;

  @Column()
  userId: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}