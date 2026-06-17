import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CurrentUser } from '../auth/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('bids')
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @Post()
  async placeBid(
    @CurrentUser() user: User,
    @Body() dto: { taskId: string; proposedAmount: number; estimatedCompletionTime: string; note?: string },
  ) {
    return this.bidsService.placeBid(user.id, dto);
  }

  @Get('task/:taskId')
  async getBidsForTask(
    @Param('taskId') taskId: string,
    @CurrentUser() user: User,
  ) {
    return this.bidsService.getBidsForTask(taskId, user.id);
  }

  @Patch(':id/accept')
  async acceptBid(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.bidsService.acceptBid(id, user.id);
  }
}
