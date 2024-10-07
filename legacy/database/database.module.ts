import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../../config/configuration';
import { User } from './entities/User';
import { Client } from './entities/Client';
import { WorkerStatus } from './entities/WorkerStatus';
import { Worker } from './entities/Worker';
import { WorkerServices } from './entities/WorkerServices';
import { Category } from './entities/Category';
import { Address } from './entities/Address';
import { Service } from './entities/Service';
import { Contract } from './entities/Contract';
import { ContractStatus } from './entities/ContractStatus';
import { Password } from './entities/Password';
import { Ratings } from './entities/Ratings';
import { TopService } from './entities/TopServices';
import { Feedback } from './entities/Feedback';

@Global()
@Module({
    imports: [TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        entities: [
            Address,
            Category,
            Client,
            Contract,
            ContractStatus,
            Password,
            Ratings,
            Feedback,
            Service,
            TopService,
            User,
            Worker,
            WorkerServices,
            WorkerStatus
        ],
        synchronize: false,
        autoLoadEntities: true
    })],
    exports: [TypeOrmModule]
})
export class DatabaseModule {
}
