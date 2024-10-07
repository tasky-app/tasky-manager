import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsController } from './controllers/ratings.controller';
import { RatingsService } from './services/ratings.service';
import { Ratings } from '../../database/entities/Ratings';
import { Contract } from 'legacy/database/entities/Contract';
import { ContractStatus } from 'legacy/database/entities/ContractStatus';
import { Address } from 'legacy/database/entities/Address';
import { Service } from 'legacy/database/entities/Service';
import { Worker } from 'legacy/database/entities/Worker';
import { Client } from 'legacy/database/entities/Client';
import { ContractService } from '../contract/services/contract.service';
import { AddressService } from '../address/services/address.service';
import { ClientService } from '../client/services/client.service';
import { ServicesService } from '../services/services/services.service';
import { UserService } from '../users/services/user.service';
import { WorkerService } from '../worker/services/worker.service';
import { TopService } from 'legacy/database/entities/TopServices';
import { WorkerServices } from 'legacy/database/entities/WorkerServices';
import { WorkerStatus } from 'legacy/database/entities/WorkerStatus';
import { User } from 'legacy/database/entities/User';

@Module({
    imports: [TypeOrmModule.forFeature([
        Contract,
        ContractStatus,
        Client,
        Worker,
        WorkerServices,
        WorkerStatus,
        Ratings,
        Service,
        TopService,
        Address,
        User])],
    providers: [
        RatingsService,
        ContractService,
        ClientService,
        WorkerService,
        ServicesService,
        AddressService,
        UserService
    ],
    controllers: [RatingsController]
})

export class RatingsModule {
}
