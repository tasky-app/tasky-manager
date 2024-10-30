import { Module } from '@nestjs/common';
import { ContractController } from './contracts.controller';
import { ContractService } from './contracts.service';
import { SecretsModule } from '../secrets/secrets.module'; 

@Module({
    imports: [SecretsModule], 
    controllers: [ContractController],
    providers: [ContractService],
    exports: [ContractService], 
})
export class ContractModule { }
