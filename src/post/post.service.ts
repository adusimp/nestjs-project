import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { PostsGateway } from './post.gateway';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly notesGateWay: PostsGateway,
  ) {}

  async getAllPost() {
    try {
      const post_list = await this.postRepository.find();
      return post_list;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async createNewPost(data) {
    try {
      const post = this.postRepository.create({
        id: data.id,
        title: data.title,
        content: data.content,
        user: { id: data.user_id },
      });
      await this.postRepository.save(post);
      this.notesGateWay.handleNotesUpdate();
      return { message: 'create new post success' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async updatePost(data) {
    try {
      await this.postRepository.update(
        { id: data.id },
        { title: data.title, content: data.content, updatedAt: new Date() },
      );
      this.notesGateWay.handleNotesUpdate();
      return { message: 'update new post success' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async deletePost(id) {
    try {
      await this.postRepository.delete({ id: id });
      this.notesGateWay.handleNotesUpdate();
      return { message: 'delete post success' };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
