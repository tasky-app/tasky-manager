import { Module } from "@nestjs/common";
import { ContractController } from "./controllers/contract.controller";
import { ContractService } from "./services/contract.service";
import { NotificationService } from "../notification/services/notification.service";
import { CloudTasksService } from "../cloud_tasks/services/cloud_tasks.service";
import { TaskersService } from "../taskers/services/taskers.service";
import { CoreModule } from "../core.module";
import { FirestoreProviders } from "../firestore/providers/firestore.providers";
import { NotificationModule } from "../notification/notification.module";
import { TaskersModule } from "../taskers/taskers.module";
import { CloudTasksModule } from "../cloud_tasks/cloud_tasks.module";

@Module({
    imports: [NotificationModule, TaskersModule, CloudTasksModule],
    providers: [
        ContractService,
        ...FirestoreProviders,
    ],
    controllers: [ContractController]
})

export class ContractModule { }