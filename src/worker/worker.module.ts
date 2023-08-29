import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Worker} from '../database/entities/Worker';
import {WorkerController} from './controllers/worker.controller';
import {WorkerServices} from '../database/entities/WorkerServices';
import {WorkerService} from './services/worker.service';
import {WorkerStatus} from '../database/entities/WorkerStatus';
import { Ratings } from 'src/database/entities/Ratings';

@Module({
    imports: [TypeOrmModule.forFeature([Worker, WorkerServices, WorkerStatus, Ratings])],
    providers: [WorkerService],
    controllers: [WorkerController]
})

export class WorkerModule {
}
