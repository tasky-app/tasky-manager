import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ContractModule } from '../contracts/contracts.module';
import { NotificationModule } from './notification/notification.module';
import { TaskersModule } from './taskers/taskers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    NotificationModule,
    ContractModule,
    TaskersModule,
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {
}
