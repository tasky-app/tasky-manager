import { Module } from "@nestjs/common";
import { ContractController } from "./controllers/contract.controller";
import { ContractService } from "./services/contract.service";
import { Contract } from "legacy/database/entities/Contract";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractStatus } from "legacy/database/entities/ContractStatus";
import { ClientService } from "../client/services/client.service";
import { Client } from "legacy/database/entities/Client";
import { WorkerService } from "../worker/services/worker.service";
import { WorkerServices } from "legacy/database/entities/WorkerServices";
import { Worker } from "legacy/database/entities/Worker";
import { WorkerStatus } from "legacy/database/entities/WorkerStatus";
import { Ratings } from "legacy/database/entities/Ratings";
import { Service } from "legacy/database/entities/Service";
import { TopService } from "legacy/database/entities/TopServices";
import { ServicesService } from "../services/services/services.service";
import { AddressService } from "../address/services/address.service";
import { Address } from "legacy/database/entities/Address";
import { User } from "legacy/database/entities/User";
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