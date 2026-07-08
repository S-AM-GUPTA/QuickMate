import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('tasks')
  getTasks() {
    return this.adminService.getAllTasks();
  }

  @Patch('users/:id/verify')
  toggleUserVerification(@Param('id') id: string) {
    return this.adminService.toggleUserVerification(id);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Patch('tasks/:id/status')
  updateTaskStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.adminService.updateTaskStatus(id, status);
  }

  @Patch('tasks/:id/location')
  updateTaskLocation(@Param('id') id: string, @Body('address') address: string) {
    return this.adminService.updateTaskLocation(id, address);
  }

  @Delete('tasks/:id')
  deleteTask(@Param('id') id: string) {
    return this.adminService.deleteTask(id);
  }

  @Post('tasks')
  createTaskForUser(@Body('customerId') customerId: string, @Body() data: any) {
    return this.adminService.createTaskForUser(customerId, data);
  }
}
