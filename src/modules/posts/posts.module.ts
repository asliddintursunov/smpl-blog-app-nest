import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/modules/database/database.module';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [DatabaseModule, CommentsModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
