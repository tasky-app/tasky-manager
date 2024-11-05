import { Module } from "@nestjs/common";
import { TaskersService } from "./services/taskers.service";
import { FirestoreProviders } from "../firestore/providers/firestore.providers";
import { SecretProvider } from "src/secrets/providers/secrets.provider";
import { TaskerController } from "./controllers/taskers.controller";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [MailModule],
  exports: [TaskersService],
  providers: [
    TaskersService,
    SecretProvider,
    ...FirestoreProviders,
  ],
  controllers: [TaskerController],
})

export class TaskersModule {
}
