import { Controller, Request, Logger, Post, Req } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('notification')
export class NotificationController {

  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {
  }

  @Post('sms')
  public async sendSms(@Req() request: Request): Promise<void> {
    return await this.notificationService.sendSms(
      request.headers['x-cellphone'],
      request.headers['x-smstype'],
      request.headers['x-name'] || undefined
    );
  }
}
