import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient, verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(ClerkService.name);
  private clerkClient: ReturnType<typeof createClerkClient>;
  private secretKey: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('CLERK_SECRET_KEY') || '';
    this.clerkClient = createClerkClient({
      secretKey: this.secretKey,
      publishableKey: this.configService.get<string>('CLERK_PUBLISHABLE_KEY'),
    });
  }

  /**
   * Verifies the Clerk session token (JWT) passed in the request header.
   */
  async verifyToken(token: string) {
    try {
      const payload = await verifyToken(token, {
        secretKey: this.secretKey,
      });
      return payload;
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetches user profile details from the Clerk API.
   * Used for on-the-fly database synchronization if a webhook lag occurs.
   */
  async getUser(userId: string) {
    try {
      const user = await this.clerkClient.users.getUser(userId);
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user from Clerk: ${error.message}`);
      throw error;
    }
  }
}
