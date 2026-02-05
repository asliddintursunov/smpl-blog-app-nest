import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCommentDto } from './dto/create-post.dto';
import { EditCommentDto } from './dto/edit-comment.dto';
import { IRequest } from 'src/types/request.type';
import { UserRoles } from 'src/constants/roles.constants';

@Injectable()
export class CommentsService {
  constructor(private db: DatabaseService) {}

  getPostComments(postId: string) {
    return this.db.comment.findMany({
      where: {
        postId,
      },
    });
  }

  async createComments(postId: string, dto: CreateCommentDto, userId: string) {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) throw new BadRequestException("Post doesn't exist!");

    return this.db.comment.create({
      data: {
        postId,
        userId,
        content: dto.content,
      },
    });
  }

  async updateComment(commentId: string, dto: EditCommentDto, req: IRequest) {
    const comment = await this.db.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        userId: true,
      },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    const isAdmin = req.user.role === UserRoles.ADMIN;
    const isAuthor = comment.userId === req.user.userId;

    if (!isAdmin && !isAuthor) {
      throw new ForbiddenException('You can edit only your own comment');
    }

    return this.db.comment.update({
      data: {
        content: dto.content,
      },
      where: {
        id: commentId,
      },
    });
  }

  async deleteComment(commentId: string, req: IRequest) {
    const comment = await this.db.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        userId: true,
      },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    const isAdmin = req.user.role === UserRoles.ADMIN;
    const isAuthor = comment.userId === req.user.userId;

    if (!isAdmin && !isAuthor) {
      throw new ForbiddenException('You can delet only your own comment');
    }

    return this.db.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
