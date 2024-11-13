import { Inject, Injectable, Logger } from "@nestjs/common";
import { IContractService } from "../interfaces/contract.interface";
import { ECountries } from "src/app/enums/countries";
import { Firestore } from "@google-cloud/firestore";
import { Contracts } from "src/core/firestore/collections/contract";
import { TaskersService } from "src/core/taskers/services/taskers.service";
import { NotificationService } from "src/core/notification/services/notification.service";
import { ENotificationType } from "src/core/notification/enums/notification_type";
import { MailService } from '../../mail/services/mail.service';

import { v2beta3 } from '@google-cloud/tasks';

import * as admin from 'firebase-admin';
import axios from "axios";
import { protos } from '@google-cloud/tasks';


@Injectable()
export class ContractService implements IContractService {

    private readonly logger = new Logger(ContractService.name);
    private client = new v2beta3.CloudTasksClient();

    constructor(
        @Inject('COLOMBIA') private readonly COL_DB: Firestore,
        @Inject('CHILE') private readonly CL_DB: Firestore,
        private readonly taskerService: TaskersService,
        private readonly notificationService: NotificationService,
        private readonly mailService: MailService,
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



    async pendingContract(taskerId: string, country: ECountries) {
        const db = country === ECountries.COLOMBIA ? this.COL_DB : this.CL_DB;

        // Query for pending contracts for the tasker
        const snapshot = await db.collection('contracts')
            .where('stateService', '==', 'pending')
            .where('taskerId', '==', taskerId)
            .get();

        if (snapshot.empty) {
            Logger.warn(`No se encontraron contratos en estado pendiente para el tasker con ID ${taskerId}`, 'pendingContract');
            throw new Error(`No se encontraron contratos en estado pendiente para el tasker con ID ${taskerId}`);
        }

        // Retrieve tasker information
        const taskerSnapshot = await db.collection('taskers').doc(taskerId).get();
        if (!taskerSnapshot.exists) {
            Logger.warn(`No se encontró el tasker con ID ${taskerId}`, 'pendingContract');
            throw new Error(`No se encontró el tasker con ID ${taskerId}`);
        }
        const taskerData = taskerSnapshot.data();

        if (!taskerData?.deviceId || !taskerData?.email) {
            Logger.warn(`El tasker con ID ${taskerId} no tiene deviceId o email registrado`, 'pendingContract');
            return;
        }

        // Assuming we're only interested in the first pending contract for the tasker
        const contractDoc = snapshot.docs[0];
        const contractData = contractDoc.data();
        const contractCreationTime = new Date(contractData.createAt);
        const currentTime = new Date();

        // Determine the expiration date based on country timezone
        const timezoneOffset = country === ECountries.COLOMBIA ? -5 * 60 : -3 * 60; // Colombia (GMT-5), Chile (GMT-3)
        const expirationDate = new Date(contractCreationTime.getTime() + 24 * 60 * 60 * 1000);
        const taskDate = expirationDate > currentTime ? expirationDate : contractCreationTime;

        // Send push notification
        const message = {
            message: {
                notification: {
                    title: 'Solicitud de servicio en Tasky 🚨',
                    body: `Tienes una nueva solicitud de servicio en Tasky 🐙. Abre la app para conocer más detalles 📝. Tienes 24 horas para aceptarla o será rechazada automáticamente.`,
                },
                token: taskerData.deviceId,
            }
        };

        const accessToken = (await admin.credential.applicationDefault().getAccessToken()).access_token;

        try {
            await axios.post(
                `https://fcm.googleapis.com/v1/projects/${process.env.PROJECT_ID_NAME}/messages:send`,
                message,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            Logger.log(`Notificación push enviada correctamente para el tasker ${taskerId} del contrato ${contractDoc.id}`, 'pendingContract');
        } catch (error) {
            Logger.error(
                `Error al enviar la notificación push para el tasker ${taskerId} del contrato ${contractDoc.id}`,
                error.response?.data || error.message,
                'pendingContract'
            );
        }

        // Send email notification
        const emailDetails = {
            to: taskerData.email,
            subject: 'Contrato pendiente - Tasky',
            text: `Tienes una nueva solicitud de servicio en Tasky 🐙. Abre la app para conocer más detalles 📝. Tienes 24 horas para aceptarla o será rechazada automáticamente.`,
        };

        try {
            await this.mailService.sendEmail(emailDetails);
            Logger.log(`Correo enviado correctamente para el tasker ${taskerId} del contrato ${contractDoc.id}`, 'pendingContract');
        } catch (error) {
            Logger.error(
                `Error al enviar el correo para el tasker ${taskerId} del contrato ${contractDoc.id}`,
                error,
                'pendingContract'
            );
        }

        // Schedule automatic rejection
        await this.scheduleAutoReject(contractDoc.id, country, taskDate);

        return {
            status: 'success',
            message: `Correo, notificación push y tarea de rechazo automático programados para el contrato ${contractDoc.id}.`
        };
    }

    async contractReject(contractId: string, country: ECountries, reason: string) {
        const db = country === ECountries.COLOMBIA ? this.COL_DB : this.CL_DB;
        const snapshot = await db.collection('contracts').where('id', '==', contractId).get();

        if (snapshot.empty) {
            Logger.warn(`No se encontraron contracts con el ID especificado`, 'contractReject');
            throw new Error(`No se encontraron contracts con el ID especificado`);
        }

        // Actualizar el contrato con la razón de cancelación
        const contractRef = snapshot.docs[0].ref;
        try {
            await contractRef.update({
                stateService: 'rejected',
                reasonCancell: reason,
            });
            Logger.log(`Contrato ${contractId} rechazado con la razón: ${reason}`, 'contractReject');
        } catch (error) {
            Logger.error(`Error al actualizar el contrato ${contractId} con la razón de cancelación`, error, 'contractReject');
            throw new Error(`Error al actualizar el contrato ${contractId} con la razón de cancelación`);
        }
    }

    private async scheduleAutoReject(contractId: string, country: ECountries, taskDate: Date) {
        const queuePath = this.client.queuePath(
            process.env.PROJECT_ID_NAME,
            process.env.LOCATION_ID,
            process.env.QUEUE_NAME
        );

        const url = `${process.env.API_BASE_URL}/contract/reject`;

        const payload = {
            contractId,
            country,
            reason: 'VENCIMIENTO_SERVICIO',
        };

        const request: protos.google.cloud.tasks.v2.ICreateTaskRequest = {
            parent: queuePath,
            task: {
                httpRequest: {
                    httpMethod: protos.google.cloud.tasks.v2.HttpMethod.POST,
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: Buffer.from(JSON.stringify(payload)).toString('base64'),
                },
                scheduleTime: {
                    seconds: Math.floor(taskDate.getTime() / 1000), 
                },
            },
        };

        try {
            await this.client.createTask(request); 
            Logger.log(`Rechazo automático programado para el contrato ${contractId} el ${taskDate}`, 'scheduleAutoReject');
        } catch (error) {
            Logger.error(`Error al programar el rechazo automático para el contrato ${contractId}`, error, 'scheduleAutoReject');
        }
    }

}