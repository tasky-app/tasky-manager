import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import configuration from '../../config/configuration';
import {User} from './entities/User';
import {ContactInfo} from './entities/ContactInfo';
import {Client} from './entities/Client';
import {WorkerStatus} from './entities/WorkerStatus';
import {Worker} from './entities/Worker';

@Global()
@Module({
    imports: [TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: configuration().db_port,
        username: configuration().db_username,
        password: configuration().db_pass,
        database: configuration().db_name,
        entities: [User, ContactInfo, Client, Worker, WorkerStatus],
        synchronize: true,
        autoLoadEntities: true
    })],
    exports: [TypeOrmModule]
})
export class DatabaseModule {}
