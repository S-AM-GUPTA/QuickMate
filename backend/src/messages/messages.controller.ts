import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CurrentUser } from '../auth/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('task/:taskId')
  async getMessages(@Param('taskId') taskId: string) {
    return this.messagesService.getMessages(taskId);
  }

  @Post()
  async sendMessage(
    @CurrentUser() user: User,
    @Body() dto: { taskId: string; messageText: string; mediaUrl?: string },
  ) {
    return this.messagesService.sendMessage(user.id, dto.taskId, dto.messageText, dto.mediaUrl);
  }
}
