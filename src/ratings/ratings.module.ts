import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RatingsController} from './controllers/ratings.controller';
import {RatingsService} from './services/ratings.service';
import {Ratings} from '../database/entities/Ratings';
import {Worker} from '../database/entities/Worker';
import { WorkerService } from 'src/worker/services/worker.service';
import { WorkerServices } from 'src/database/entities/WorkerServices';
import { WorkerStatus } from 'src/database/entities/WorkerStatus';
import { ClientService } from 'src/client/services/client.service';
import { Client } from 'src/database/entities/Client';
import { Contract } from 'src/database/entities/Contract';
import { ContractService } from 'src/contract/services/contract.service';

@Module({
    imports: [TypeOrmModule.forFeature([Ratings, Contract])],
    providers: [RatingsService, ContractService],
    controllers: [RatingsController]
})

export class RatingsModule {
}
