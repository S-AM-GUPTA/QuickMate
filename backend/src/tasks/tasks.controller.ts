import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async createTask(@CurrentUser() user: User, @Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(user.id, dto);
  }

  @Get()
  async getTasks(@CurrentUser() user: User) {
    return this.tasksService.getTasks(user);
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
}
