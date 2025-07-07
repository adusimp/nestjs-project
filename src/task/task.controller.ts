import {
  Controller,
  Post,
  Body,
  Logger,
  Get,
  Query,
  ParseIntPipe,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/task.dto';
import { TaskService } from './task.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileUploadService } from './fileUpload.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly fileUploadService: FileUploadService,
  ) {}
  @Post()
  async addTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.addTask(createTaskDto);
  }
  @Get()
  async getAllTask(@Query('page', ParseIntPipe) page: number) {
    return this.taskService.getAllTask(page);
  }
  @Get(':id')
  async getTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getTaskById(id);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Chỉ cho phép file ảnh!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadTaskFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!await this.taskService.getTaskById(id))
      throw new BadRequestException('Task not found');
    const filepath = await this.fileUploadService.uploadFile(file);
    return this.taskService.uploadFilePath(id, filepath);
  }
}
