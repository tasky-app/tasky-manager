import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ContractModule } from './contract/contract.module';
import { NotificationModule } from './notification/notification.module';
import { FirestoreProviders } from './firestore/providers/firestore.providers';
import { TaskersModule } from './taskers/taskers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    NotificationModule,
    ContractModule,
    TaskersModule,
  ],
  controllers: [],
  providers: [...FirestoreProviders,],
})
export class CoreModule {
}
