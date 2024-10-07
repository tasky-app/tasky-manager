import { Module } from "@nestjs/common";
import configuration from "config/configuration";
import { CloudTasksService } from "./services/cloud_tasks.service";

@Module({
  imports: [],
  providers: [
    {
      provide: "CloudTaskParent",
      useFactory: async () => {
        return require('')(
          configuration().twilio_account_sid,
          configuration().twilio_account_token
        );
      }
    },
    CloudTasksService]
})
export class CloudTasksModule {
}
