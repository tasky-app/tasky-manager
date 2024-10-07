import { Inject, Injectable, Logger } from "@nestjs/common";
import configuration from "config/configuration";
import { ITaskersService } from "../interfaces/taskers.interface";
import { CloudTasksClient } from '@google-cloud/tasks';
import { Tasker } from "src/modules/firestore/collections/taskers";

const messagingSid = configuration().twilio_messaging_sid;

@Injectable()
export class TaskersService implements ITaskersService {

    private readonly logger = new Logger(TaskersService.name);

    constructor(@Inject('GTasksClient') private readonly tasksClient: CloudTasksClient) {
    }
    
    getTaskerById(taskerId: string): Promise<Tasker> {
        throw new Error("Method not implemented.");
    }

}
