import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { DatabaseModule } from '../database/database.module';
import { CommentsController } from './comments.controller';

@Module({
  imports: [DatabaseModule],
  exports: [CommentsService],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
