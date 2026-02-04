import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  imports: [DatabaseModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
