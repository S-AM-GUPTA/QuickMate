import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import type { User } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createReview(
    @CurrentUser() user: User,
    @Body()
    dto: {
      taskId: string;
      revieweeId: string;
      rating: number;
      comment?: string;
    },
  ) {
    return this.reviewsService.createReview({
      taskId: dto.taskId,
      reviewerId: user.id,
      revieweeId: dto.revieweeId,
      rating: dto.rating,
      comment: dto.comment,
    });
  }
}
