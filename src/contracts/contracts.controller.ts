import { Controller, Post, Get, Param } from '@nestjs/common';
import { ContractService } from './contracts.service';

@Controller('contracts')
export class ContractController {
    constructor(private readonly contractService: ContractService) { }

    @Get(':id/balanceTasker')
    async getTotalBalance(@Param('id') id: string): Promise<number> {
        return await this.contractService.calculateTotalBalance(id);
    }

    @Post()
    async createContract() {
        return this.contractService.createContract();
    }

    @Post('post-tasks')
    async postTasks() {
        return this.contractService.postTasks();
    }
}