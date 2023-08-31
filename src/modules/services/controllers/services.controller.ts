import {Controller, Get, Headers, Logger} from "@nestjs/common";
import {ServicesService} from '../services/services.service';
import { TopService } from "src/database/entities/TopServices";
import { Service } from "src/database/entities/Service";

@Controller("services")
export class ServicesController {

    private readonly logger = new Logger(ServicesController.name);

    constructor(private readonly servicesService: ServicesService) {
    }

    //OK - 27/08/2023
    @Get("/top")
    public async getTopServices(): Promise<TopService[]> {
        this.logger.log(`INICIA OBTENCIÓN DE LOS SERVICIOS DESTACADOS`);
        const topServices = this.servicesService.getTopServices();
        this.logger.log(`FINALIZA OBTENCIÓN DE LOS SERVICIOS DESTACADOS CON RESULTADO -> ${JSON.stringify(topServices)}`);
        return topServices;
    }

    //OK - 27/08/2023
    @Get()
    public async getAllServices(): Promise<Service[]> {
        this.logger.log(`INICIA OBTENCIÓN DE TODOS LOS SERVICIOS`);
        const services = this.servicesService.getAllServices();
        this.logger.log(`FINALIZA OBTENCIÓN DE TODOS LOS SERVICIOS CON RESULTADO -> ${JSON.stringify(services)}`);
        return services;
    }
}
