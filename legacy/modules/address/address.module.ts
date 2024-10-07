import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../../database/entities/Address';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { User } from 'legacy/database/entities/User';
import { UserService } from '../users/services/user.service';
import { Client } from 'legacy/database/entities/Client';
import { Worker } from 'legacy/database/entities/Worker';

@Module({
    imports: [TypeOrmModule.forFeature([Address, User, Client, Worker])],
    providers: [AddressService, UserService],
    controllers: [AddressController]
})

export class AddressModule {
}
