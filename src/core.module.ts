import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import {VerifyModule} from './verify/verify.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), VerifyModule],
  controllers: [],
  providers: [],
})
export class CoreModule {}
