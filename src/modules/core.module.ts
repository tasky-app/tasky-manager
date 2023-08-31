import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { DatabaseModule } from 'src/database/database.module';
import { AddressModule } from '../modules/address/address.module';
import { VerifyModule } from '../modules/verify/verify.module';
import { UserModule } from '../modules/users/user.module';
import { WorkerModule } from '../modules/worker/worker.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { ServicesModule } from '../modules/services/services.module';
import { RatingsModule } from '../modules/ratings/ratings.module';
import { ClientModule } from '../modules/client/client.module';
import { ContractModule } from '../modules/contract/contract.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        AddressModule,
        CategoriesModule,
        ClientModule,
        ContractModule,
        RatingsModule,
        ServicesModule,
        UserModule,
        VerifyModule,
        WorkerModule,
        DatabaseModule
    ],
    controllers: [],
    providers: [],
})
export class CoreModule {
}
