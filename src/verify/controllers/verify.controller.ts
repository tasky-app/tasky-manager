import { Controller, Headers, Logger, Post } from "@nestjs/common";
import { VerifyService } from "../services/verify.service";

@Controller("notification")
export class VerifyController {

  private readonly logger = new Logger(VerifyController.name);

  constructor(private readonly notificationService: VerifyService) {
  }

  @Post()
  public async sendVerifyNotification(@Headers() headers): Promise<void> {
    this.logger.log(`INICIA ENVIO DE OTP DE VERIFICACIÓN POR ${headers.channel.toUpperCase()} CON DESTINATARIO ${headers.recipient}`);
    await this.notificationService.sendOtp(headers.channel, headers.recipient);
    this.logger.log(`FINALIZA ENVIO DE OTP DE VERIFICACIÓN POR ${headers.channel.toUpperCase()} CON DESTINATARIO ${headers.recipient}`);
  }

  @Post("/verify")
  public async verifyOtp(@Headers() headers): Promise<void> {
    this.logger.log(`INICIA VALIDACIÓN DE OTP [CÓDIGO: ${headers.otp}]`);
    await this.notificationService.validateOtp(headers.otp, headers.recipient);
    this.logger.log(`FINALIZA VALIDACIÓN DE OTP [CÓDIGO: ${headers.otp}]`);
  }
}