import { Module } from "@nestjs/common";
import { TaskersService } from "./services/taskers.service";

@Module({
  imports: [],
  providers: [TaskersService]
})
export class TaskersModule {
}
