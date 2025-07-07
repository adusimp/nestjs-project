import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async addOneUser(userData: User) {
    const SaltOrRounds = 10;
    userData.password = await bcrypt.hash(userData.password, SaltOrRounds);
    const date = new Date();
    userData.CreatedAt = getFullDateTime();
    userData.UpdatedAt = getFullDateTime();

    const data = this.userRepository.create(userData);
    return await this.userRepository.save(data);
  }
  async findOne(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }
  async isDuplicate(email: string): Promise<boolean> {
    const user = await this.findOne(email);
    if (!user) {
      return false;
    }
    return true;
  }

    
}
export function getFullDateTime(): string {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }