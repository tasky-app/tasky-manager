import {Module} from '@nestjs/common';
import {UserService} from './services/user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'legacy/database/entities/User';
import {Client} from 'legacy/database/entities/Client';
import {Worker} from 'legacy/database/entities/Worker';
import {UserController} from './controllers/user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Client, Worker])],
    providers: [UserService],
    controllers: [UserController]
})

export class UserModule {
}
