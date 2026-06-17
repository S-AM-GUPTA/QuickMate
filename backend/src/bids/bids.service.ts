import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BidsService {
  constructor(private prisma: PrismaService) {}

  async placeBid(helperId: string, dto: { taskId: string; proposedAmount: number; estimatedCompletionTime: string; note?: string }) {
    const task = await this.prisma.task.findUnique({ where: { id: dto.taskId } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.status !== 'OPEN') throw new BadRequestException('Task is not open for bids');

    return this.prisma.bid.create({
      data: {
        taskId: dto.taskId,
        helperId: helperId,
        proposedAmount: dto.proposedAmount,
        estimatedCompletionTime: new Date(dto.estimatedCompletionTime),
        note: dto.note
      }
    });
  }

  async getBidsForTask(taskId: string, customerId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.customerId !== customerId) {
      throw new NotFoundException('Task not found or unauthorized');
    }

    return this.prisma.bid.findMany({
      where: { taskId },
      include: {
        helper: {
          select: { id: true, name: true, phone: true, rating: true, completedTasksCount: true, isVerified: true, skills: true }
        }
      },
      orderBy: { proposedAmount: 'asc' }
    });
  }

  async acceptBid(bidId: string, customerId: string) {
    const bid = await this.prisma.bid.findUnique({ where: { id: bidId }, include: { task: true } });
    if (!bid || bid.task.customerId !== customerId) {
      throw new NotFoundException('Bid not found or unauthorized');
    }
    if (bid.status !== 'PENDING') {
      throw new BadRequestException('Bid is already processed');
    }

    // Transaction to update bid status and task status
    return this.prisma.$transaction(async (prisma) => {
      // Reject all other bids
      await prisma.bid.updateMany({
        where: { taskId: bid.taskId, id: { not: bidId } },
        data: { status: 'REJECTED' }
      });

      // Accept this bid
      const acceptedBid = await prisma.bid.update({
        where: { id: bidId },
        data: { status: 'ACCEPTED' }
      });

      // Assign task
      await prisma.task.update({
        where: { id: bid.taskId },
        data: { status: 'ASSIGNED', assignedHelperId: bid.helperId }
      });

      return acceptedBid;
    });
  }
}
