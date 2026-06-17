import { Controller, Post, Body } from '@nestjs/common';
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
}
