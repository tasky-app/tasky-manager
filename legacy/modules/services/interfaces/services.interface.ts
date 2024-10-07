import { Service } from "legacy/database/entities/Service";
import { TopService } from "legacy/database/entities/TopServices";

export interface IServicesService {
    getTopServices(): Promise<TopService[]>;
    getAllServices(): Promise<Service[]>;
    getServiceById(serviceId: number): Promise<Service>;
}