import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '../../config/configuration';

import { TaskersModule } from './taskers/taskers.module';
import { NotificationModule } from './notification/notification.module';
import { ContractModule } from './contract/contract.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    NotificationModule,
    ContractModule,
    TaskersModule,
    MailModule
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {
}
