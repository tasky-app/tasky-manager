import { Inject, Injectable, Logger } from "@nestjs/common";
import configuration from "config/configuration";
import { ITaskersService } from "../interfaces/taskers.interface";
import { CloudTasksClient } from '@google-cloud/tasks';
import { Tasker } from "src/core/firestore/collections/taskers";
import { ECountries } from "src/app/enums/countries";
import { Firestore } from "@google-cloud/firestore";

const messagingSid = configuration().twilio_messaging_sid;

@Injectable()
export class TaskersService implements ITaskersService {

    private readonly logger = new Logger(TaskersService.name);

    constructor(
        @Inject('COLOMBIA') private readonly COL_DB: Firestore,
        @Inject('CHILE') private readonly CL_DB: Firestore,
    ) {
    }

    async getTaskerById(taskerId: string, country: ECountries): Promise<Tasker> {
        this.logger.log(`[ID:${taskerId}] [COUNTRY:${country}] Inicia obtención de la información del tasker`);
        const database = country == ECountries.COLOMBIA ? this.COL_DB : this.CL_DB;
        const collection = Tasker.collectionName;
        const ref = await database.collection(collection).doc(taskerId);
        const docInfo = await ref.get();
        if (docInfo.exists) {
            console.log('Document data:', docInfo.data());
            this.logger.log(`[ID:${taskerId}] [COUNTRY:${country}] Finaliza obtención de la información del tasker`);
            return Tasker.fromJson(docInfo.data());
        } else {
            throw Error('No existe el tasker en la bd');
        }
    }

}
