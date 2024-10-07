import { Controller, Get, Logger } from "@nestjs/common";
import { ServicesService } from '../services/services.service';
import { TopService } from "legacy/database/entities/TopServices";
import { Service } from "legacy/database/entities/Service";
import { TaskyException } from "src/exceptions/tasky_exception";

@Controller("services")
export class ServicesController {

    private readonly logger = new Logger(ServicesController.name);

    constructor(private readonly servicesService: ServicesService) {
    }

    //OK - 27/08/2023
    @Get("/top")
    public async getTopServices(): Promise<TopService[]> {
        this.logger.log(`INICIA OBTENCIÓN DE LOS SERVICIOS DESTACADOS`);
        return this.servicesService.getTopServices().then((topServices) => {
            this.logger.log(`FINALIZA OBTENCIÓN DE LOS SERVICIOS DESTACADOS CON RESULTADO -> ${JSON.stringify(topServices)}`);
            return topServices;
        }).catch(() => {
            throw new TaskyException(500, "Ocurrió un error al obtener los servicios destacados");
        });
    }

    //OK - 27/08/2023
    @Get()
    public async getAllServices(): Promise<Service[]> {
        this.logger.log(`INICIA OBTENCIÓN DE TODOS LOS SERVICIOS`);
        return this.servicesService.getAllServices().then((services) => {
            this.logger.log(`FINALIZA OBTENCIÓN DE TODOS LOS SERVICIOS CON RESULTADO -> ${JSON.stringify(services)}`);
            return services;
        }).catch((err) => {
            this.logger.error("Error al obtener todos los servicios -> ", err);
            throw new TaskyException(500, "Ocurrió un error al obtener todos los servicios");
        });
    }
}
