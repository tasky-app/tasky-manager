import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ContactInfo} from '../database/entities/ContactInfo';
import {Address} from '../database/entities/Address';
import {AddressController} from './controllers/address.controller';
import {AddressService} from './services/address.service';

@Module({
    imports: [TypeOrmModule.forFeature([ContactInfo, Address])],
    providers: [AddressService],
    controllers: [AddressController]
})

export class AddressModule {
}
