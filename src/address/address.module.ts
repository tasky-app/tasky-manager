import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Address} from '../database/entities/Address';
import {AddressController} from './controllers/address.controller';
import {AddressService} from './services/address.service';
import {UserModule} from '../users/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Address]), UserModule],
    providers: [AddressService],
    controllers: [AddressController]
})

export class AddressModule {
}
