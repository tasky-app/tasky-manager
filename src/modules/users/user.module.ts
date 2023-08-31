import {Module} from '@nestjs/common';
import {UserService} from './services/user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'src/database/entities/User';
import {Client} from 'src/database/entities/Client';
import {Worker} from 'src/database/entities/Worker';
import {UserController} from './controllers/user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Client, Worker])],
    providers: [UserService],
    controllers: [UserController]
})

export class UserModule {
}
