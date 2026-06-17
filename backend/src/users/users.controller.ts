import { Controller, Get, Patch, Body } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import type { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: User) {
    return user;
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }
}
