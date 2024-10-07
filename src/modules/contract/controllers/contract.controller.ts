import { Controller, Inject, Logger, Post, Headers, Body, Get, Req } from "@nestjs/common";
import { ContractService } from "../services/contract.service";

@Controller("contract")
export class ContractController {

    private readonly logger = new Logger(ContractController.name);

    constructor(private readonly contractService: ContractService) {
    }

    @Post('post-tasks')
    async executePostContractTasks(@Req() request: Request) {
        this.logger.log(`[CONTRACT ID:${request.headers['X-Contract-Id']}] INICIA EJECUCIÓN DE TAREAS POST-CONTRATACIÓN`)
        await this.contractService.(request);
        this.logger.log(`[CLIENT CEL:${request.headers['X-Contract-Id']}] FINALIZA EJECUCIÓN DE TAREAS POST-CONTRATACIÓN`)
    }
}