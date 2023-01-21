import {Module} from '@nestjs/common';
import {VerifyController} from '../controllers/verify.controller';
import {VerifyService} from '../services/verify.service';

@Module({
    controllers: [VerifyController],
    providers: [
        {
            provide: 'TwilioClient',
            useFactory: async () => {
                return require('twilio')(
                    'ACa4234bf9038ae0707ef0ad68b2fa6fe3',
                    'dd420bd1cb83d6f588c8f49a2fbbafd0',
                );
            }
        },
        VerifyService]
})
export class VerifyModule {
}
