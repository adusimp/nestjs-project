import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres.xydfkjuedkkuexuiikxb:moichoigame2@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres',
      autoLoadEntities: true,
      synchronize: true, // chỉ dùng trong dev
    }),
    ConfigModule.forRoot({isGlobal:true}),
     MulterModule.register({
      dest: './uploads',
    }),
    UserModule,
    PostModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
