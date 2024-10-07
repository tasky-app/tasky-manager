import { Module } from "@nestjs/common";
import { NotificationController } from "./controllers/notification.controller";
import { NotificationService } from "./services/notification.service";
import configuration from "config/configuration";

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [
    {
      provide: "TwilioClient",
      useFactory: async () => {
        return require("twilio")(
          configuration().twilio_account_sid,
          configuration().twilio_account_token
        );
      }
    },
    NotificationService]
})
export class NotificationModule {
}
