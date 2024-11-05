import { ENotificationType } from "../enums/notification_type";

export interface INotificationService {
    sendSms(cellphone: string, type: ENotificationType, name?: string): Promise<void>;
}
