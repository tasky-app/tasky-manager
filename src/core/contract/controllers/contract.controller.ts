import { Controller, Post, Request, Req, Get, Param } from "@nestjs/common";
import { ContractService } from "../services/contract.service";
import { HeadersConstants } from "src/app/constants/headers";

@Controller("contract")
export class ContractController {


    constructor(private readonly contractService: ContractService) {
    }

    @Get('balanceTasker')
    async getTotalBalance(@Req() request: Request): Promise<number> {
        return await this.contractService.calculateTotalBalance(
            request.headers[HeadersConstants.TASKER_ID],
            request.headers[HeadersConstants.COUNTRY]
        );
    }

    @Post('post-tasks')
    async executePostContractTasks(@Req() request: Request) {
        await this.contractService.executePostContractTasks(
            request.headers[HeadersConstants.CONTRACT_ID],
            request.headers[HeadersConstants.COUNTRY]
        );
    }
}