import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { DatabaseModule } from 'legacy/database/database.module';
import { AddressModule } from './address/address.module';
import { VerifyModule } from './verify/verify.module';
import { UserModule } from './users/user.module';
import { WorkerModule } from './worker/worker.module';
import { CategoriesModule } from './categories/categories.module';
import { ServicesModule } from './services/services.module';
import { RatingsModule } from './ratings/ratings.module';
import { ClientModule } from './client/client.module';
import { ContractModule } from './contract/contract.module';
import { FeedbackModule } from './feedback/feedback.module';

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
        FeedbackModule,
        DatabaseModule
    ],
    controllers: [],
    providers: [],
})
export class CoreModule {
}
