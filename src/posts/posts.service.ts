import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private db: DatabaseService) {}

  getPublishedPosts() {
    return this.db.post.findMany({
      where: { isPublished: true },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
  }

  createPost(userId: string, dto: CreatePostDto) {
    return this.db.post.create({
      data: {
        ...dto,
        authorId: userId,
      },
    });
  }
}
