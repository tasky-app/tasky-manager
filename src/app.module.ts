import { Module } from '@nestjs/common';
import { ContractModule } from './contracts/contracts.module';
import { AvailabilityModule } from './availability/availability.module';
import { SecretsModule } from './secrets';
import { TaskersModule } from './taskers/taskers.module';   

@Module({
    imports: [ContractModule, AvailabilityModule, SecretsModule, TaskersModule],
})
export class AppModule { }
