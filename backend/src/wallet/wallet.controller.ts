import { Controller, Get, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { User } from '@prisma/client';
import { FraudDetectionInterceptor } from './fraud.interceptor';

@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  getBalance(@CurrentUser() user: User) {
    return this.walletService.getBalance(user.id);
  }

  @Post('add-funds')
  addDemoFunds(@CurrentUser() user: User, @Body('amount') amount: number) {
    return this.walletService.addDemoFunds(user.id, amount);
  }

  @Post('escrow')
  @UseInterceptors(FraudDetectionInterceptor)
  escrowFunds(@CurrentUser() user: User, @Body('amount') amount: number, @Body('taskId') taskId: string) {
    // In a real app, this would hold funds for a specific task.
    // For now, it's a mock that could just debit the user or log it.
    return { success: true, message: `Escrowed ${amount} for task ${taskId}` };
  }

  @Post('topup')
  @UseInterceptors(FraudDetectionInterceptor)
  topupFunds(@CurrentUser() user: User, @Body('amount') amount: number) {
    return this.walletService.addDemoFunds(user.id, amount);
  }
}
