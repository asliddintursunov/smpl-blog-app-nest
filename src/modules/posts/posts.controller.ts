import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { type IRequest } from 'src/types/request.type';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/dto/create-post.dto';
import { Comment } from '@prisma/client';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
  ) {}

  // ========== POSTS ==========
  @Get()
  async getPublished() {
    return this.postsService.getPublishedPosts();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreatePostDto, @Req() req: IRequest) {
    return this.postsService.createPost(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: IRequest) {
    return this.postsService.delete(id, req);
  }

  // ========== COMMENTS ==========
  @UseGuards(JwtAuthGuard)
  @Get(':id/comments')
  async getPostComments(@Param('id') id: string): Promise<Comment[]> {
    return this.commentsService.getPostComments(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createComments(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Req() req: IRequest,
  ) {
    return this.commentsService.createComments(id, dto, req.user.userId);
  }
}
