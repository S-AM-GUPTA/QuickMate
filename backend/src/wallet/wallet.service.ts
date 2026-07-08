import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });
    
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      balance: user?.walletBalance || 0,
      transactions,
    };
  }

  async addDemoFunds(userId: string, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: { increment: amount },
        },
      });

      await tx.transaction.create({
        data: {
          userId,
          amount,
          type: 'CREDIT',
          description: 'Added Demo Funds',
        },
      });

      return { balance: user.walletBalance, message: 'Demo funds added successfully' };
    });
  }
}
