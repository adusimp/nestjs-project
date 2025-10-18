import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostsGateway } from './post.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, PostsGateway],
  controllers: [PostController],
})
export class PostModule {}
