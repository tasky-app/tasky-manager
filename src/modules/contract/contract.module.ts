import { Module } from "@nestjs/common";
import { ContractController } from "./controllers/contract.controller";
import { ContractService } from "./services/contract.service";
import { Contract } from "src/database/entities/Contract";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractStatus } from "src/database/entities/ContractStatus";
import { ClientService } from "../client/services/client.service";
import { Client } from "src/database/entities/Client";
import { WorkerService } from "../worker/services/worker.service";
import { WorkerServices } from "src/database/entities/WorkerServices";
import { Worker } from "src/database/entities/Worker";
import { WorkerStatus } from "src/database/entities/WorkerStatus";
import { Ratings } from "src/database/entities/Ratings";
import { Service } from "src/database/entities/Service";
import { TopService } from "src/database/entities/TopServices";
import { ServicesService } from "../services/services/services.service";
import { AddressService } from "../address/services/address.service";
import { Address } from "src/database/entities/Address";
import { User } from "src/database/entities/User";
import { UserService } from "../users/services/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([
        Contract,
        ContractStatus,
        Client,
        Worker,
        WorkerServices,
        WorkerStatus,
        Ratings,
        Service,
        TopService,
        Address,
        User])],
    providers: [
        ContractService,
        ClientService,
        WorkerService,
        ServicesService,
        AddressService,
        UserService
    ],
    controllers: [ContractController]
})

export class ContractModule { }