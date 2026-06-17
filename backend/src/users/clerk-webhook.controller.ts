import {
  Controller,
  Post,
  Req,
  BadRequestException,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';
import { UsersService } from './users.service';
import { Public } from '../auth/public.decorator';

@Controller('webhooks')
export class ClerkWebhookController {
  private readonly logger = new Logger(ClerkWebhookController.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('clerk')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: Request,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    const webhookSecret = this.configService.get<string>(
      'CLERK_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      this.logger.error('CLERK_WEBHOOK_SECRET is not configured');
      throw new BadRequestException('Webhook configuration error');
    }

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new BadRequestException('Missing svix headers');
    }

    const rawBody = (req as any).rawBody;
    if (!rawBody) {
      this.logger.error(
        'Raw body not found. Make sure rawBody: true is passed to NestFactory.create',
      );
      throw new BadRequestException('Raw body missing');
    }

    const payloadString = rawBody.toString('utf8');
    const wh = new Webhook(webhookSecret);
    let event: any;

    try {
      event = wh.verify(payloadString, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as any;
    } catch (err) {
      this.logger.error(
        `Webhook signature verification failed: ${err.message}`,
      );
      throw new BadRequestException('Invalid webhook signature');
    }

    const { type, data } = event;
    this.logger.log(`Received Clerk webhook event: ${type}`);

    try {
      switch (type) {
        case 'user.created': {
          const email =
            data.email_addresses?.find(
              (e: any) => e.id === data.primary_email_address_id,
            )?.email_address ||
            data.email_addresses?.[0]?.email_address ||
            '';
          const name =
            `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User';
          const phone =
            data.phone_numbers?.find(
              (p: any) => p.id === data.primary_phone_number_id,
            )?.phone_number ||
            data.phone_numbers?.[0]?.phone_number ||
            null;

          await this.usersService.create({
            id: data.id,
            email,
            name,
            phone,
          });
          this.logger.log(`Synced newly created user: ${data.id}`);
          break;
        }

        case 'user.updated': {
          const email =
            data.email_addresses?.find(
              (e: any) => e.id === data.primary_email_address_id,
            )?.email_address ||
            data.email_addresses?.[0]?.email_address ||
            '';
          const name =
            `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User';
          const phone =
            data.phone_numbers?.find(
              (p: any) => p.id === data.primary_phone_number_id,
            )?.phone_number ||
            data.phone_numbers?.[0]?.phone_number ||
            null;

          await this.usersService.update(data.id, {
            email,
            name,
            phone,
          });
          this.logger.log(`Synced updated user: ${data.id}`);
          break;
        }

        case 'user.deleted': {
          await this.usersService.delete(data.id);
          this.logger.log(`Synced deleted user: ${data.id}`);
          break;
        }

        default:
          this.logger.warn(`Unhandled webhook event type: ${type}`);
      }
    } catch (dbError) {
      this.logger.error(`Error processing database sync: ${dbError.message}`);
      throw new BadRequestException('Database sync error');
    }

    return { received: true };
  }
}
