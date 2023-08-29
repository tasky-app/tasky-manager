import { Service } from "src/database/entities/Service";
import { Worker } from "src/database/entities/Worker";
import { EWorkerStatus } from "../enums/worker_status_enum";

export interface IWorkerService {
    getWorkerServices(cellphone: string);
    saveWorkerServices(cellphone: string, services: Service[]);
    getWorkerInfo(cellphone: string);
    saveWorkerInfo(cellphone: string, worker: Worker);
    updateWorkerState(cellphone: string, status: EWorkerStatus);
    getTopWorkers(cellphone: string): Promise<Worker[]>;
    getWorkersByService(serviceId: number): Promise<Worker[]>;
}