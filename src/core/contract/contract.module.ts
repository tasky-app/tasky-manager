import { Module } from "@nestjs/common";
import { ContractController } from "./controllers/contract.controller";
import { ContractService } from "./services/contract.service";
import { FirestoreProviders } from "../firestore/providers/firestore.providers";
import { TaskersModule } from "../taskers/taskers.module";
import { CloudTasksModule } from "../cloud_tasks/cloud_tasks.module";
import { NotificationModule } from "../notification/notification.module";
import { SecretProvider } from "src/secrets/providers/secrets.provider";
import { MailModule } from "../mail/mail.module";

@Module({
    imports: [NotificationModule, TaskersModule, CloudTasksModule, MailModule],
    providers: [
        ContractService,
        SecretProvider,
        ...FirestoreProviders,
    ],
    controllers: [ContractController]
})

export class ContractModule { }