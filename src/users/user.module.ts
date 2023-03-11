import {Module} from '@nestjs/common';
import {UserService} from './services/user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../database/entities/User';
import {Client} from '../database/entities/Client';
import {Worker} from '../database/entities/Worker';
import {UserController} from './controllers/user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Client, Worker])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})

export class UserModule {
}
