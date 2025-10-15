import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
    private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    
  ) {}

  async getAllPost(){
    try {
        const post_list = await this.postRepository.find();
        return post_list;
    } catch (error) {
        this.logger.error(error)
        throw error
    }
  }
  async createNewPost(data){
    try {
        const post = this.postRepository.create({
            id:data.id,
            title:data.title,
            content:data.content,
            user:{id:data.user_id}
        });
        await this.postRepository.save(post);
        return {message:"create new post success"}
    } catch (error) {
        this.logger.error(error)
        throw error
    }
  }
  async updatePost(data){
    try {
        this.postRepository.update({id:data.id},{title:data.title,content:data.content,updatedAt:new Date()})
        return {message:"update new post success"}  
    } catch (error) {
        this.logger.error(error)
        throw error
    }
  }
  async deletePost(id){
    try {
        await this.postRepository.delete({id:id});
        return {message:"delete post success"}
    } catch (error) {
        this.logger.error(error)
        throw error
    }
  }
}
