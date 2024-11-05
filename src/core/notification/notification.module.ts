import { Module } from "@nestjs/common";
import { NotificationController } from "./controllers/notification.controller";
import { NotificationService } from "./services/notification.service";
import configuration from "config/configuration";

@Module({
  exports: [NotificationService],
  controllers: [NotificationController],
  providers: [
    {
      provide: "TwilioClient",
      useFactory: async () => {
        return require("twilio")(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN,
        );
      }
    },
    NotificationService]
})
export class NotificationModule {
}
