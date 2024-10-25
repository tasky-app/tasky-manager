import { Controller, Logger, Post, Request, Req } from "@nestjs/common";
import { ContractService } from "../services/contract.service";
import { HeadersConstants } from "src/app/constants/headers";

@Controller("contract")
export class ContractController {

    private readonly logger = new Logger(ContractController.name);

    constructor(private readonly contractService: ContractService) {
    }

    @Post('post-tasks')
    async executePostContractTasks(@Req() request: Request) {
        this.logger.log(request.headers);
        this.logger.log(`[CONTRACT ID:${request.headers[HeadersConstants.CONTRACT_ID]} INICIA EJECUCIÓN DE TAREAS POST-CONTRATACIÓN`)
        await this.contractService.executePostContractTasks(
            request.headers[HeadersConstants.CONTRACT_ID],
            request.headers[HeadersConstants.COUNTRY]
        );
        
        this.logger.log(`[CONTRACT CEL:${request.headers[HeadersConstants.CONTRACT_ID]}] FINALIZA EJECUCIÓN DE TAREAS POST-CONTRATACIÓN`)
    }
}