import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import configuration from '../../config/configuration';
import {User} from './entities/User';
import {ContactInfo} from './entities/ContactInfo';
import {Client} from './entities/Client';
import {WorkerStatus} from './entities/WorkerStatus';
import {Worker} from './entities/Worker';
import {WorkerServices} from './entities/WorkerServices';
import {Category} from './entities/Category';
import {Address} from './entities/Address';
import {Service} from './entities/Service';

@Global()
@Module({
    imports: [TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: configuration().db_port,
        username: configuration().db_username,
        password: configuration().db_pass,
        database: configuration().db_name,
        entities: [
            User,
            ContactInfo,
            Client,
            Worker,
            WorkerStatus,
            WorkerServices,
            Category,
            Address,
            Service
        ],
        synchronize: false,
        autoLoadEntities: true
    })],
    exports: [TypeOrmModule]
})
export class DatabaseModule {
}
