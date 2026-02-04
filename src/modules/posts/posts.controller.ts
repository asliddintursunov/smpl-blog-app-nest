import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { type IRequest } from 'src/types/request.type';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getPublished() {
    return this.postsService.getPublishedPosts();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreatePostDto, @Req() req: IRequest) {
    return this.postsService.createPost(req.user.userId, dto);
  }
}
