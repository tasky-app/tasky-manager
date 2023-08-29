import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import configuration from '../config/configuration';
import {DatabaseModule} from './database/database.module';
import {AddressModule} from './address/address.module';
import { VerifyModule } from './verify/verify.module';
import { UserModule } from './users/user.module';
import { WorkerModule } from './worker/worker.module';
import { CategoriesModule } from './categories/categories.module';
import { ServicesModule } from './services/services.module';

@Module({
    imports: [ConfigModule.forRoot({isGlobal: true, load: [configuration]}),
        VerifyModule,
        UserModule,
        AddressModule,
        WorkerModule,
        CategoriesModule,
        ServicesModule,
        DatabaseModule],
    controllers: [],
    providers: [],
})
export class CoreModule {
}
