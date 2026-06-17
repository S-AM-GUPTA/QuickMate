import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email,
        name: data.name,
        phone: data.phone,
      },
      create: data,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        role: dto.role,
        phone: dto.phone,
        skills: dto.skills,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
    });
  }
}
