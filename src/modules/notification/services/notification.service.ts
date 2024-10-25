import { Inject, Injectable, Logger } from "@nestjs/common";
import configuration from "config/configuration";
import { Twilio } from "twilio";
import { INotificationService } from "../interfaces/notification.interface";
import { ENotificationType } from "../enums/notification_type";
import { SmsTemplates } from "../utils/sms_templates";

const messagingSid = configuration().twilio_messaging_sid;

@Injectable()
export class NotificationService implements INotificationService {
  constructor(@Inject('TwilioClient') private readonly client: Twilio) {
  }

  private readonly logger = new Logger(NotificationService.name);

  sendSms(cellphone: string, type: ENotificationType): Promise<void> {
    this.logger.log(`INICIA ENVIO DE SMS DE TIPO ${type} A -> ${cellphone}`);
    return this.client.messages
      .create({
        body: SmsTemplates.Messages[type],
        messagingServiceSid: messagingSid,
        to: cellphone
      })
      .then(message => {
        this.logger.log(`FINALIZA ENVIO DE SMS DE TIPO ${type} A -> ${cellphone}`);
        console.log(message.sid)
      });
  }
}
