import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TopService } from "src/database/entities/TopServices";
import { Service } from "src/database/entities/Service";
import { ServicesService } from "./services/services.service";
import { ServicesController } from "./controllers/services.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TopService, Service])],
  controllers: [ServicesController],
  providers: [
    ServicesService]
})
export class ServicesModule {
}
