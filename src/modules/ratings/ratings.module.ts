import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RatingsController} from './controllers/ratings.controller';
import {RatingsService} from './services/ratings.service';
import {Ratings} from '../../database/entities/Ratings';
import { Contract } from 'src/database/entities/Contract';
import { ContractService } from '../contract/services/contract.service';

@Module({
    imports: [TypeOrmModule.forFeature([Ratings, Contract])],
    providers: [RatingsService, ContractService],
    controllers: [RatingsController]
})

export class RatingsModule {
}
