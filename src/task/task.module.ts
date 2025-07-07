import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { FileUploadService } from './fileUpload.service';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [TaskService, FileUploadService],
  controllers: [TaskController],
  exports: [],
})
export class TaskModule {}
