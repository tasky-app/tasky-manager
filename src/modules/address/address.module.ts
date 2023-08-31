import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../../database/entities/Address';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { User } from 'src/database/entities/User';
import { UserService } from '../users/services/user.service';
import { Client } from 'src/database/entities/Client';
import { Worker } from 'src/database/entities/Worker';

@Module({
    imports: [TypeOrmModule.forFeature([Address, User, Client, Worker])],
    providers: [AddressService, UserService],
    controllers: [AddressController]
})

export class AddressModule {
}
