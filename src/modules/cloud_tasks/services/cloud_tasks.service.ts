import { Inject, Injectable, Logger } from "@nestjs/common";
import configuration from "config/configuration";
import { ICloudTasksService } from "../interfaces/cloud_tasks.interface";
import { CloudTasksClient } from '@google-cloud/tasks';

const messagingSid = configuration().twilio_messaging_sid;

@Injectable()
export class CloudTasksService implements ICloudTasksService {

    private readonly logger = new Logger(CloudTasksService.name);
    
    constructor(@Inject('GTasksClient') private readonly tasksClient: CloudTasksClient) {
    }
    createContractTimeoutTask(contractId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteContractTimeoutTask(contractId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
