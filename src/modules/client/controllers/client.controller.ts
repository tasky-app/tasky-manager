import { Controller, Get, Logger, Headers } from "@nestjs/common";
import { Client } from "src/database/entities/Client";
import { ClientService } from "../services/client.service";

@Controller("client")
export class ClientController {

    private readonly logger = new Logger(ClientController.name);

    constructor(private readonly clientService: ClientService) { }

    @Get()
    async getClientInfo(@Headers() headers): Promise<Client> {
        this.logger.log(`CEL: [${headers.cellphone}] INICIA CONSULTA DE LA INFORMACIÓN DEL CLIENTE`)
        return this.clientService.getClientInfo(headers.cellphone).then(response => {
            this.logger.log(`CEL: [${headers.cellphone}] FINALIZA CONSULTA DE LA INFORMACIÓN DEL CLIENTE CON RESULTADO -> ${JSON.stringify(response)}`)
            return response;
        });
    }
}