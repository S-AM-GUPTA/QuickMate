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

  async toggleUserVerification(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    return this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: !user.isVerified },
    });
  }

  async deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async updateTaskStatus(taskId: string, status: any) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }

  async deleteTask(taskId: string) {
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  async createTaskForUser(customerId: string, data: any) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        budget: data.budget,
        category: data.category,
        urgency: data.urgency || 'medium',
        latitude: data.latitude,
        longitude: data.longitude,
        scheduledTime: new Date(data.scheduledTime),
        customerId: customerId,
      },
    });
  }
}
