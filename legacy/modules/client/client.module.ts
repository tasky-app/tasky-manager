import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "legacy/database/entities/Client";
import { ClientService } from "./services/client.service";
import { ClientController } from "./controllers/client.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Client])],
    controllers: [ClientController],
    providers: [ClientService]
  })
  export class ClientModule {
  }
  