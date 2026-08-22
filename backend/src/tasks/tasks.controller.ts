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
    return this.tasksService.getDynamicPriceSuggestion(dto);
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

  @UseGuards(AuthGuard)
  @Get(':id/matches')
  async getSmartMatches(@Param('id') id: string) {
    return this.tasksService.getSmartMatches(id);
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
