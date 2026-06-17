import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getMessages(taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.message.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, role: true }
        }
      }
    });
  }

  async sendMessage(senderId: string, taskId: string, messageText: string, mediaUrl?: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.message.create({
      data: {
        taskId,
        senderId,
        messageText,
        mediaUrl
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true }
        }
      }
    });
  }
}
