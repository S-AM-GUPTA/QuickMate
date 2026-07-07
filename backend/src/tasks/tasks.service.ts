import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new task posted by a customer.
   * Note: The database trigger "update_task_coords" automatically computes
   * and updates the PostGIS Point coords based on the latitude and longitude.
   */
  async createTask(customerId: string, dto: CreateTaskDto) {
    const customer = await this.prisma.user.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        budget: dto.budget,
        category: dto.category,
        urgency: dto.urgency,
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
        scheduledTime: new Date(dto.scheduledTime),
        attachmentUrls: dto.attachmentUrls || [],
        customerId: customerId,
      },
    });
  }

  async getTasks(user: any) {
    if (user.role === 'customer') {
      // Return tasks posted by this customer
      return this.prisma.task.findMany({
        where: { customerId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          assignedHelper: {
            select: { id: true, name: true, phone: true, rating: true, isVerified: true }
          }
        }
      });
    } else {
      // Return open tasks for helpers, or tasks assigned to them
      return this.prisma.task.findMany({
        where: {
          OR: [
            { status: 'OPEN' },
            { assignedHelperId: user.id }
          ]
        },
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, name: true, rating: true, isVerified: true }
          }
        }
      });
    }
  }

  async updateTaskStatus(taskId: string, status: any, userId: string) {
    // Basic update
    return this.prisma.task.update({
      where: { id: taskId },
      data: { status }
    });
  }
}
