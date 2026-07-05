import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const totalTasks = await this.prisma.task.count();
    const totalRevenue = await this.prisma.task.aggregate({
      _sum: { budget: true },
      where: { status: 'COMPLETED' },
    });
    const pendingBids = await this.prisma.bid.count({
      where: { status: 'PENDING' },
    });

    return {
      totalUsers,
      totalTasks,
      totalRevenue: totalRevenue._sum.budget || 0,
      pendingBids,
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getAllTasks() {
    return this.prisma.task.findMany({
      include: { 
        customer: { select: { id: true, name: true, email: true } }, 
        assignedHelper: { select: { id: true, name: true, email: true } } 
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
