import { Module } from "@nestjs/common";
import { TaskersService } from "./services/taskers.service";
import { FirestoreProviders } from "../firestore/providers/firestore.providers";

@Module({
  exports: [TaskersService],
  providers: [
    TaskersService, 
    ...FirestoreProviders,
  ]
})
export class TaskersModule {
}
