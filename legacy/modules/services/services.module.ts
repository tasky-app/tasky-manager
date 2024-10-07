import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TopService } from "legacy/database/entities/TopServices";
import { Service } from "legacy/database/entities/Service";
import { ServicesService } from "./services/services.service";
import { ServicesController } from "./controllers/services.controller";
import { Client } from "legacy/database/entities/Client";
import { ClientService } from "../client/services/client.service";
import { User } from "legacy/database/entities/User";
import { WorkerService } from "../worker/services/worker.service";

@Module({
  imports: [TypeOrmModule.forFeature([TopService, Service])],
  controllers: [ServicesController],
  providers: [
    ServicesService]
})
export class ServicesModule {
}
