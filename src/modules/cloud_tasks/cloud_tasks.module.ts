import { Module } from "@nestjs/common";
import configuration from "config/configuration";
import { CloudTasksService } from "./services/cloud_tasks.service";

@Module({
  exports: [CloudTasksService],
  providers: [
    // {
    //   provide: "CloudTaskParent",
    //   useFactory: async () => {
    //     return require('@google-cloud/tasks')(
    //       configuration().twilio_account_sid,
    //       configuration().twilio_account_token
    //     );
    //   }
    // },
    CloudTasksService]
})
export class CloudTasksModule {
}
