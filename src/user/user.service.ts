import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // async findOne(username: String): Promise<User | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }
  async addOneUser(userData: User) {
    const SaltOrRounds = 10;
    userData.password = await bcrypt.hash(userData.password, SaltOrRounds);
    const data = this.userRepository.create(userData);
    return await this.userRepository.save(data);
  }
  async findOne(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }
  async isDuplicate(email: string): Promise<boolean> {
    const user = this.findOne(email);
    if (!user) return true;
    return false;
  }
}
