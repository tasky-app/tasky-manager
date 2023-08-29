import { Service } from "src/database/entities/Service";
import { Worker } from "src/database/entities/Worker";
import { EWorkerStatus } from "../enums/worker_status_enum";

export interface IWorkerService {
    getWorkerServices(documentNumber: string);
    saveWorkerServices(documentNumber: string, services: Service[]);
    getWorkerInfo(documentNumber: string);
    saveWorkerInfo(documentNumber: string, worker: Worker);
    updateWorkerState(documentNumber: string, status: EWorkerStatus);
    getTopWorkers(cellphone: string): Promise<Worker[]>;
}