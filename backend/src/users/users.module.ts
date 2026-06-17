import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClerkWebhookController } from './clerk-webhook.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController, ClerkWebhookController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
