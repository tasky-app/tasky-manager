import { Module } from "@nestjs/common";
import { TaskersService } from "./services/taskers.service";
import { FirestoreProviders } from "../firestore/providers/firestore.providers";
import { SecretProvider } from "src/secrets/providers/secrets.provider";

@Module({
  exports: [TaskersService],
  providers: [
    TaskersService, 
    SecretProvider,
    ...FirestoreProviders,
  ]
})
export class TaskersModule {
}
