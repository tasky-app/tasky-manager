import { Module } from "@nestjs/common";
import { ContractController } from "./controllers/contract.controller";
import { ContractService } from "./services/contract.service";
import { NotificationService } from "../notification/services/notification.service";
import { CloudTasksService } from "../cloud_tasks/services/cloud_tasks.service";
import { TaskersService } from "../taskers/services/taskers.service";

@Module({
    imports: [],
    providers: [
        ContractService,
        NotificationService,
        CloudTasksService,
        TaskersService,
    ],
    controllers: [ContractController]
})

export class ContractModule { }