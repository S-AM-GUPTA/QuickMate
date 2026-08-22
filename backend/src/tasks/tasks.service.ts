import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  /**
   * AI-driven Dynamic Price Suggestion
   * Considers category base, complexity, urgency, and real-time platform demand.
   */
  async getDynamicPriceSuggestion(dto: { title: string; description: string; category: string; urgency: string }) {
    let basePrice = 200; // Base starting price

    // Category modifiers
    if (dto.category === 'Moving assistance') basePrice = 600;
    else if (dto.category === 'Cleaning') basePrice = 400;
    else if (dto.category === 'Tech support' || dto.category === 'Repair') basePrice = 500;
    else if (dto.category === 'Delivery' || dto.category === 'Grocery help') basePrice = 250;
    
    // Natural Language Processing complexity heuristic (longer/detailed = more complex)
    const textLen = (dto.title?.length || 0) + (dto.description?.length || 0);
    if (textLen > 150) basePrice += 150;
    else if (textLen > 50) basePrice += 50;

    // Urgency modifier
    let urgencyMultiplier = 1.0;
    if (dto.urgency === 'urgent') urgencyMultiplier = 1.5;
    else if (dto.urgency === 'low') urgencyMultiplier = 0.8;

    // Real-time demand calculation (Simulated AI feature)
    // Counts open tasks in the same category to gauge current demand
    const openTasksCount = await this.prisma.task.count({
      where: {
        category: dto.category,
        status: 'OPEN'
      }
    });

    // Surge pricing based on demand: +5% for every open task in that category (capped at 1.5x)
    const demandSurge = Math.min(1.0 + (openTasksCount * 0.05), 1.5);
    
    // Time of day surge (e.g. night time 10 PM - 6 AM is more expensive)
    const currentHour = new Date().getHours();
    const timeSurge = (currentHour >= 22 || currentHour < 6) ? 1.2 : 1.0;

    // Final AI computed price
    const finalPrice = basePrice * urgencyMultiplier * demandSurge * timeSurge;

    return {
      suggestedPrice: Math.round(finalPrice / 10) * 10, // Round to nearest 10
      currency: 'INR',
      breakdown: {
        basePrice,
        urgencyMultiplier,
        demandSurge,
        timeSurge,
        currentCategoryDemand: openTasksCount
      }
    };
  }

  /**
   * AI-based Safety & Fraud Detection
   * Evaluates if a task has suspicious elements before creation.
   */
  private analyzeFraudRisk(dto: CreateTaskDto): boolean {
    const suspiciousKeywords = ['pay outside', 'cash only', 'wire transfer', 'crypto', 'scam', 'money laundering', 'western union'];
    const textToAnalyze = `${dto.title} ${dto.description}`.toLowerCase();
    
    // Check for suspicious phrases
    for (const keyword of suspiciousKeywords) {
      if (textToAnalyze.includes(keyword)) {
        return true;
      }
    }
    
    // Check for abnormal budgets (e.g., > ₹1,00,000 for simple chores)
    if (dto.budget > 100000 && ['Cleaning', 'Delivery', 'Grocery help', 'Miscellaneous errands'].includes(dto.category)) {
      return true;
    }

    return false;
  }

  /**
   * Smart Mate Matching Engine
   * Ranks suitable nearby mates using distance, skills, ratings, and past performance.
   */
  async getSmartMatches(taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    
    const radiusMeters = 50000; // 50 km radius to find mates
    const helpers: any = await this.prisma.$queryRaw`
      SELECT u.id, u.name, u.rating, u.completed_tasks_count as "completedTasksCount", u.skills, u.coords, u.latitude, u.longitude,
      ST_Distance(u.coords, ST_SetSRID(ST_MakePoint(${task.longitude}, ${task.latitude}), 4326)) as distance
      FROM users u
      WHERE u.role = 'helper'
      AND ST_DWithin(
        u.coords, 
        ST_SetSRID(ST_MakePoint(${task.longitude}, ${task.latitude}), 4326), 
        ${radiusMeters}
      )
    `;

    const rankedHelpers = helpers.map(h => {
      // Calculate match score
      let score = 50;
      
      const distKm = h.distance / 1000;
      if (distKm < 5) score += 30;
      else if (distKm < 15) score += 15;
      else if (distKm < 30) score += 5;
      
      const hasSkill = Array.isArray(h.skills) && h.skills.includes(task.category);
      if (hasSkill) score += 15;
      
      score += (h.rating / 5) * 15;
      score += Math.min((h.completedTasksCount || 0) / 50, 1) * 10;
      
      return {
        id: h.id,
        name: h.name,
        rating: h.rating,
        completedTasksCount: h.completedTasksCount,
        distanceKm: Math.round(distKm * 10) / 10,
        matchScore: Math.round(score)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return rankedHelpers;
  }

  /**
   * Creates a new task posted by a customer.
   */
  async createTask(customerId: string, dto: CreateTaskDto) {
    if (this.analyzeFraudRisk(dto)) {
      throw new BadRequestException('Task flagged for suspicious activity or policy violation by our AI Safety engine.');
    }

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
