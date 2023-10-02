import { Controller, Inject, Logger, Post, Headers, Body, Get } from "@nestjs/common";
import { ContractService } from "../services/contract.service";
import { SaveContractDto } from "../dto/saveContractDto";

@Controller("contract")
export class ContractController {

    private readonly logger = new Logger(ContractController.name);

    constructor(private readonly contractService: ContractService) {
    }

    @Post()
    async saveContract(@Body() request: SaveContractDto) {
        this.logger.log(`[CLIENT CEL:${request.clientId}] INICIA CREACIÓN DE CONTRATO CON INFO -> ${JSON.stringify(request)}`)
        await this.contractService.createContract(request);
        this.logger.log(`[CLIENT CEL:${request.clientId}] FINALIZA CREACIÓN DE CONTRATO`)
    }


    @Get("by-client")
    async getContractByClient(@Headers() headers) {
        this.logger.log(`[CLIENT CEL:${headers.cellphone}] INICIA OBTENCIÓN DE CONTRATOS DEL CLIENTE`)
        return this.contractService.getClientContracts(headers.cellphone).then(response => {
            this.logger.log(`[CLIENT CEL:${headers.cellphone}] FINALIZA OBTENCIÓN DE CONTRATOS DEL CLIENTE CON RESULTADO -> ${JSON.stringify(response)}`)
            return response;
        });
    }
}