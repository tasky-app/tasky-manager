import { Module } from "@nestjs/common";
import { ContractController } from "./controllers/contract.controller";
import { ContractService } from "./services/contract.service";
import { Contract } from "src/database/entities/Contract";

@Module({
    imports: [Contract],
    controllers: [ContractController],
    providers: [ContractService]
})

export class ContractModule {}