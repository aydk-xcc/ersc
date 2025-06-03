import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedInitialData();
  }

  private async seedInitialData() {
    // 检查是否已有用户数据
    const userCount = await this.usersRepository.count();
    
    if (userCount === 0) {
      console.log('正在初始化用户数据...');
      
      const initialUsers = [
        {
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123',
          bio: '系统管理员',
          isActive: true,
        },
        {
          username: 'john_doe',
          email: 'john@example.com',
          password: 'password123',
          bio: '普通用户',
          isActive: true,
        },
        {
          username: 'jane_smith',
          email: 'jane@example.com',
          password: 'password123',
          bio: '测试用户',
          isActive: false,
        },
      ];

      for (const userData of initialUsers) {
        const user = this.usersRepository.create(userData);
        await this.usersRepository.save(user);
      }

      console.log('用户数据初始化完成！');
    }
  }
} 