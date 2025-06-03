import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ChatSession } from '../../chat-session/entities/chat-session.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatSessionId: number; // 外键，关联到chat-session表

  @Column({ type: 'varchar', length: 20 })
  role: string; // 'user' | 'assistant' | 'system'

  @Column({ type: 'text' })
  content: string; // 消息内容

  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelName: string; // 使用的大模型名称（仅AI消息有）

  @Column({ type: 'json', nullable: true })
  modelConfig: any; // 模型配置参数（仅AI消息有）

  @Column({ type: 'json', nullable: true })
  metadata: any; // 额外的元数据

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 多对一关系：多个chat属于一个chat-session
  @ManyToOne(() => ChatSession, chatSession => chatSession.chats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatSessionId' })
  chatSession: ChatSession;
} 