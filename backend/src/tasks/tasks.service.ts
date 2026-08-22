import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
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
        isFixedPrice: dto.isFixedPrice || false,
        customerId: customerId,
      },
    });
  }

  async getTasks(user: any, requestedRole?: string) {
    const roleToUse = requestedRole || user.role;
    if (roleToUse === 'customer') {
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
      if (user.latitude && user.longitude) {
        // Geospatial search: 20km radius
        const radiusMeters = 20000;
        const tasks: any = await this.prisma.$queryRaw`
          SELECT t.*, 
            json_build_object('id', u.id, 'name', u.name, 'rating', u.rating, 'isVerified', u.is_verified) as customer
          FROM tasks t
          JOIN users u ON t.customer_id = u.id
          WHERE (t.status = 'OPEN' OR t.assigned_helper_id = ${user.id})
          AND ST_DWithin(
            t.coords, 
            ST_SetSRID(ST_MakePoint(${user.longitude}, ${user.latitude}), 4326), 
            ${radiusMeters}
          )
          ORDER BY t.created_at DESC
        `;
        
        // Prisma $queryRaw returns snake_case for model fields if mapped in schema.
        // Let's just return the fallback if mapping is complex, or map it.
        // Actually, our schema maps to camelCase on the client side, but $queryRaw returns raw DB column names.
        // A simpler way: Fetch the IDs and then findMany.
        const taskIds = tasks.map((t: any) => t.id);
        
        if (taskIds.length > 0) {
          return this.prisma.task.findMany({
            where: { id: { in: taskIds } },
            orderBy: { createdAt: 'desc' },
            include: {
              customer: {
                select: { id: true, name: true, rating: true, isVerified: true }
              }
            }
          });
        } else {
          return [];
        }
      }

      // Fallback if no location
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
      data: { status },
    });
  }

  async updateTask(taskId: string, customerId: string, dto: any) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.customerId !== customerId) throw new ForbiddenException('Unauthorized');
    
    // Only pick fields that belong to the model
    const allowedFields = ['title', 'description', 'budget', 'category', 'urgency', 'latitude', 'longitude', 'address', 'scheduledTime'];
    const updateData: any = {};
    for (const key of allowedFields) {
      if (dto[key] !== undefined) {
        updateData[key] = dto[key];
      }
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });
  }

  async deleteTask(taskId: string, customerId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.customerId !== customerId) throw new ForbiddenException('Unauthorized');

    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  async instantAccept(taskId: string, helperId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.status !== 'OPEN') throw new BadRequestException('Task is not open');
    if (!task.isFixedPrice) throw new BadRequestException('This task does not support instant accept');

    const customer = await this.prisma.user.findUnique({ where: { id: task.customerId } });
    if ((customer?.walletBalance || 0) < task.budget) {
      throw new BadRequestException('Customer has insufficient funds in escrow. Cannot instantly accept.');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Deduct budget from customer's wallet
      await prisma.user.update({
        where: { id: task.customerId },
        data: { walletBalance: { decrement: task.budget } }
      });
      await prisma.transaction.create({
        data: {
          userId: task.customerId,
          amount: task.budget,
          type: 'DEBIT',
          description: `Payment for task: ${task.title}`
        }
      });

      // Create an accepted bid to maintain history
      const bid = await prisma.bid.create({
        data: {
          taskId: taskId,
          helperId: helperId,
          proposedAmount: task.budget,
          estimatedCompletionTime: task.scheduledTime,
          status: 'ACCEPTED',
          note: 'Instantly accepted via Fixed Price option'
        }
      });

      // Assign the task to the helper
      await prisma.task.update({
        where: { id: taskId },
        data: { status: 'ASSIGNED', assignedHelperId: helperId }
      });

      await prisma.notification.create({
        data: {
          userId: task.customerId,
          title: 'Task Accepted',
          message: `A helper has instantly accepted your fixed-price task "${task.title}".`,
        }
      });

      return { success: true, message: 'Task instantly accepted', bid };
    });
  }
}
