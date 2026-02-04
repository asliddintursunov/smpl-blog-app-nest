import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UserRoles } from 'src/constants/roles.constants';
import { IRequest } from 'src/types/request.type';

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

  async delete(postId: string, req: IRequest) {
    const post = await this.db.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const isAdmin = req.user.role === UserRoles.ADMIN;
    const isAuthor = post.authorId === req.user.userId;

    if (!isAdmin && !isAuthor) {
      throw new ForbiddenException('You can delete only your own post');
    }

    return this.db.post.delete({
      where: { id: postId },
    });
  }
}
