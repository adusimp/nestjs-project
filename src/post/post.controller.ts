import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPost() {
    return await this.postService.getAllPost();
  }
  @Post()
  async createNewPost(@Body() data) {
    return await this.postService.createNewPost(data);
  }
  @Put()
  async updatePost(@Body() data) {
    return await this.postService.updatePost(data);
  }
  @Delete(':id')
  async deletePost(@Param('id') id) {
    return await this.postService.deletePost(id);
  }
}
