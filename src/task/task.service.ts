import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { getFullDateTime } from 'src/user/user.service';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async addTask(data: Partial<Task>) {
    data.CreatedAt = getFullDateTime();
    data.UpdatedAt = getFullDateTime();
    const task = this.taskRepository.create(data);
    return await this.taskRepository.save(task);
  }
  async getAllTask(page: number) {
    const limit = 2;
    if (page >= 1) {
      const [items, total] = await this.taskRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      return {
        data: items,
        meta: {
          totalItems: total,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPage: Math.ceil(total / limit),
          currentPage: page,
        },
      };
    }

    return await this.taskRepository.find();
  }
  async getTaskById(id: number): Promise<Task | null> {
    return await this.taskRepository.findOneBy({ id });
  }
  
  async uploadFilePath(id: number, path: string) {
    return await this.taskRepository.update(id, { file_path: path });
  }
}
