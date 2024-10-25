import { Controller, Request, Logger, Post, Req } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('notification')
export class NotificationController {

  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {
  }

  @Post('sms')
  public async sendSms(@Req() request: Request): Promise<void> {
    this.logger.log(`INICIA ENVIO DE SMS`);
    await this.notificationService.sendSms(request.headers['X-Cellphone'], request.headers['X-SmsType']);
    this.logger.log(`FINALIZA ENVIO DE SMS`);
  }
}
