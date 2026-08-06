import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(data: {
    taskId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    comment?: string;
  }) {
    const review = await this.prisma.review.create({
      data: {
        taskId: data.taskId,
        reviewerId: data.reviewerId,
        targetUserId: data.revieweeId,
        rating: data.rating,
        feedbackText: data.comment,
      },
    });

    // Update the average rating of the reviewee
    const allReviews = await this.prisma.review.findMany({
      where: { targetUserId: data.revieweeId },
      select: { rating: true },
    });

    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await this.prisma.user.update({
      where: { id: data.revieweeId },
      data: { rating: averageRating },
    });

    return review;
  }
}
