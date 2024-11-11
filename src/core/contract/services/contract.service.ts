import { Inject, Injectable, Logger } from "@nestjs/common";
import { IContractService } from "../interfaces/contract.interface";
import { CloudTasksService } from "src/core/cloud_tasks/services/cloud_tasks.service";
import { ECountries } from "src/app/enums/countries";
import { Firestore } from "@google-cloud/firestore";
import { Contracts } from "src/core/firestore/collections/contract";
import { TaskersService } from "src/core/taskers/services/taskers.service";
import { NotificationService } from "src/core/notification/services/notification.service";
import { ENotificationType } from "src/core/notification/enums/notification_type";


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
        const database = ECountries.COLOMBIA.includes(country) ? this.COL_DB : this.CL_DB;
        const collection = Contracts.collectionName;
        const ref = await database.collection(collection).doc(contractId);
        const docInfo = await ref.get();
        if (docInfo.exists) {
            console.log('Document data:', docInfo.data());
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

    }

    private async publishTask(contractId: string) {
        this.logger.log(`Inicia publicación del evento en la cola`)
        this.tasksService.createContractTimeoutTask(contractId)
            .then(() => {
                this.logger.log(`Finaliza publicación del evento en la cola`)
            });
    }


    async calculateTotalBalance(taskerId: string, country: ECountries): Promise<object> {
        const db = country === ECountries.COLOMBIA ? this.COL_DB : this.CL_DB;
        Logger.log(`Iniciando cálculo de balance para el tasker con ID ${taskerId} en el país ${country}`, 'calculateTotalBalance');

        try {
            const snapshot = await db.collection('contracts')
                .where('stateService', '==', 'finished')
                .where('taskerId', '==', taskerId)
                .get();

            Logger.log(`Consulta realizada en la base de datos: ${snapshot.size} contratos encontrados`, 'calculateTotalBalance');

            if (snapshot.empty) {
                Logger.warn(`No se encontraron contratos finalizados para el tasker con ID ${taskerId}`, 'calculateTotalBalance');
                return {
                    result: false,
                    msg: `No se encontraron contratos finalizados para el tasker con ID ${taskerId}`,
                    totalBalance: 0
                };
            }

            let totalBalance = 0;

            snapshot.forEach(doc => {
                const contract = doc.data();
                Logger.debug(`Procesando contrato con ID: ${doc.id} y datos: ${JSON.stringify(contract)}`, 'calculateTotalBalance');

                if (contract.totalPayment) {
                    if (contract.typeMembership === 'free') {
                        const amount = contract.totalPayment * 0.7;
                        totalBalance += amount;
                        Logger.debug(`Contrato de tipo 'free': sumando ${amount} al balance total`, 'calculateTotalBalance');
                    } else if (contract.typeMembership === 'premium') {
                        totalBalance += contract.totalPayment;
                        Logger.debug(`Contrato de tipo 'premium': sumando ${contract.totalPayment} al balance total`, 'calculateTotalBalance');
                    }
                }
            });

            const roundedTotalBalance = Math.round(totalBalance);
            Logger.log(`Balance total calculado exitosamente: ${roundedTotalBalance}`, 'calculateTotalBalance');
            return {
                result: true,
                msg: 'Balance calculado exitosamente',
                totalBalance: roundedTotalBalance
            };

        } catch (error) {
            Logger.error(`Error al calcular el balance para el tasker con ID ${taskerId}: ${error.message}`, error.stack, 'calculateTotalBalance');
            throw new Error('Error al calcular el balance');
        }
    }



}