import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { EditCommentDto } from './dto/edit-comment.dto';
import { type IRequest } from 'src/types/request.type';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: EditCommentDto,
    @Req() req: IRequest,
  ) {
    return this.commentsService.updateComment(id, dto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: IRequest) {
    return this.commentsService.deleteComment(id, req);
  }
}
