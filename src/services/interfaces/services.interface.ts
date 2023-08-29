import { Service } from "src/database/entities/Service";
import { TopService } from "src/database/entities/TopServices";

export interface IServicesService {
    getTopServices(): Promise<TopService[]>;
    getAllServices(): Promise<Service[]>;
}