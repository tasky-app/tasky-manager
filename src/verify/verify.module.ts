import { Module } from "@nestjs/common";
import { VerifyController } from "./controllers/verify.controller";
import { VerifyService } from "./services/verify.service";
import configuration from "../../config/configuration";

@Module({
  controllers: [VerifyController],
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
    VerifyService]
})
export class VerifyModule {
}
