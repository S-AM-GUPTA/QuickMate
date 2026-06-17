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
        scheduledTime: new Date(dto.scheduledTime),
        attachmentUrls: dto.attachmentUrls || [],
        customerId: customerId,
      },
    });
  }
}
