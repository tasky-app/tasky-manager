import { Module } from "@nestjs/common";
import { VerifyController } from "./controllers/verify.controller";
import { VerifyService } from "./services/verify.service";
import { PasswordController } from "./controllers/password.controller";
import { PasswordService } from "./services/password.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Password } from "src/database/entities/Password";
import { User } from "src/database/entities/User";
import { Client } from "src/database/entities/Client";
import { Worker } from "src/database/entities/Worker";
import configuration from "config/configuration";
import { UserService } from "../users/services/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([Password, User, Client, Worker])],
  controllers: [VerifyController, PasswordController],
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
    VerifyService, PasswordService, UserService]
})
export class VerifyModule {
}
