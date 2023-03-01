import {Module} from '@nestjs/common';
import {UserService} from './services/user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../database/entities/User';
import {Client} from '../database/entities/Client';
import {Worker} from '../database/entities/Worker';
import {UserController} from './controllers/user.controller';
import {ContactInfo} from '../database/entities/ContactInfo';

@Module({
    imports: [TypeOrmModule.forFeature([User, Client, Worker, ContactInfo])],
    providers: [UserService],
    controllers: [UserController]
})

export class UserModule {
}
