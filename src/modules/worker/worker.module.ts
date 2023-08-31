import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerController } from './controllers/worker.controller';
import { WorkerService } from './services/worker.service';
import { Ratings } from 'src/database/entities/Ratings';
import { Worker } from 'src/database/entities/Worker';
import { WorkerServices } from 'src/database/entities/WorkerServices';
import { WorkerStatus } from 'src/database/entities/WorkerStatus';

@Module({
    imports: [TypeOrmModule.forFeature([Worker, WorkerServices, WorkerStatus, Ratings])],
    providers: [WorkerService],
    controllers: [WorkerController]
})

export class WorkerModule {
}
