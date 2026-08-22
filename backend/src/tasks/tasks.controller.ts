import { Controller, Post, Body, Get, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import type { User } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('price-suggestion')
  async suggestPrice(@Body() dto: { title: string; description: string; category: string; urgency: string }) {
    // Heuristic Simulation for AI Price Suggestion
    let basePrice = 100;
    
    // Category modifiers
    if (dto.category === 'Moving assistance') basePrice += 200;
    if (dto.category === 'Cleaning') basePrice += 150;
    if (dto.category === 'Tech support' || dto.category === 'Repair') basePrice += 150;
    if (dto.category === 'Delivery' || dto.category === 'Grocery help') basePrice += 50;
    
    // Text length modifier (longer = more complex)
    const textLen = (dto.title?.length || 0) + (dto.description?.length || 0);
    if (textLen > 100) basePrice += 50;
    
    // Urgency modifier
    if (dto.urgency === 'urgent') basePrice *= 1.5;
    if (dto.urgency === 'low') basePrice *= 0.8;
    
    return {
      suggestedPrice: Math.round(basePrice),
      currency: 'INR'
    };
  }

  @Post()
  async createTask(@CurrentUser() user: User, @Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getTasks(@CurrentUser() user: User, @Query('role') role?: string) {
    return this.tasksService.getTasks(user, role);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.updateTaskStatus(id, status, user.id);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() dto: Partial<CreateTaskDto>,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.updateTask(id, user.id, dto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.deleteTask(id, user.id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/instant-accept')
  async instantAccept(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.instantAccept(id, user.id);
  }
}
