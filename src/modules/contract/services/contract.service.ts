import { Inject, Injectable, Logger } from "@nestjs/common";
import { IContractService } from "../interfaces/contract.interface";
import { CloudTasksService } from "src/modules/cloud_tasks/services/cloud_tasks.service";
import { NotificationService } from "src/modules/notification/services/notification.service";
import { ENotificationType } from "src/modules/notification/enums/notification_type";
import { ECountries } from "src/app/enums/countries";
import { Firestore } from "@google-cloud/firestore";
import * as admin from 'firebase-admin';

import { Contracts } from "src/modules/firestore/collections/contract";
import { TaskersService } from "src/modules/taskers/services/taskers.service";
import { getFirestore } from "firebase-admin/firestore";
// import { SecretManager } from "config/secret_manager";
// import configuration from "config/configuration";

// const secretManager = new SecretManager();
// const secretReference = configuration().secret_name;


@Injectable()
export class ContractService implements IContractService {

    private readonly logger = new Logger(ContractService.name);

    constructor(
        @Inject('COLOMBIA') private readonly COL_DB: Firestore,
        @Inject('CHILE') private readonly CL_DB: Firestore,
        private readonly tasksService: CloudTasksService,
        private readonly taskerService: TaskersService,
        private readonly notificationService: NotificationService,
    ) { }

    async getContractById(contractId: string, country: ECountries): Promise<Contracts> {
        this.logger.log(`[ID:${contractId}] [COUNTRY:${country}] Inicia obtención de la información del contrato`);
        const database =  ECountries.COLOMBIA.includes(country) ? this.COL_DB : this.CL_DB;
        const collection = Contracts.collectionName;
        const ref = await database.collection(collection).doc(contractId);
        const docInfo = await ref.get();
        if (docInfo.exists) {
            console.log('Document data:', docInfo.data());
            this.logger.log(`[ID:${contractId}] [COUNTRY:${country}] Finaliza obtención de la información del contrato`);
            return Contracts.fromJson(docInfo.data());
        } else {
            throw Error('No existe el contrato en la bd');
        }
    }

    async executePostContractTasks(contractId: string, country: ECountries): Promise<void> {
        const contract = await this.getContractById(contractId, country);
        const tasker = await this.taskerService.getTaskerById(contract.taskerId, country);
        const phoneNumber = `${tasker.phoneExtension}${tasker.phoneNumber}`;
        await this.notificationService.sendSms(phoneNumber, ENotificationType.CONTRACT_CREATED);
        // await this.publishTask(contractId);
    }

    private async publishTask(contractId: string) {
        this.logger.log(`Inicia publicación del evento en la cola`)
        this.tasksService.createContractTimeoutTask(contractId)
            .then(() => {
                this.logger.log(`Finaliza publicación del evento en la cola`)
            });
    }
}