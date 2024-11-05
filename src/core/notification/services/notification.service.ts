import { Injectable } from "@nestjs/common";
import * as Twilio from 'twilio';

import { INotificationService } from "../interfaces/notification.interface";
import { ENotificationType } from "../enums/notification_type";
import { SmsTemplates } from "../utils/sms_templates";

@Injectable()
export class NotificationService implements INotificationService {
  private client: Twilio.Twilio;

  constructor() {
    this.client = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendSms(cellphone: string, type: ENotificationType, name?: string): Promise<void> {
    try {
      const messageBody = SmsTemplates.Messages[type](name);

      const response = await this.client.messages.create({
        body: messageBody,
        messagingServiceSid: process.env.TWILIO_MESSAGING_SID,
        to: cellphone,
      });

      console.log("Mensaje enviado:", response);
    } catch (error) {
      console.error("Error al enviar el SMS:", error.message);
    }
  }
}