import {ENotificationChannel} from '../enums/notification_channel';
import {HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import {Twilio} from 'twilio';

const verifySid = 'VA6b36c1961e6a5af9d29ead2d87a22b77';
@Injectable()
export class VerifyService {
    constructor(@Inject('TwilioClient') private readonly twilioClient: Twilio) {
    }

    private readonly logger = new Logger(VerifyService.name);

    public async sendOtp(channel: ENotificationChannel, recipient: string): Promise<any> {
        return await this.twilioClient.verify.v2
            .services(verifySid)
            .verifications.create({to: recipient, channel: channel})
            .then(() => this.logger.log('La OTP se envió correctamente'))
            .catch(err => {
                this.logger.error('Ocurrió un error al enviar la OTP')
                throw new InternalServerErrorException('Ocurrió un error al enviar la notificación -> ', err)
            });
    }

    public async validateOtp(otp, recipientNumber): Promise<any> {
        return await this.twilioClient.verify.v2
            .services(verifySid)
            .verificationChecks.create({to: recipientNumber, code: otp})
            .then((verificationCheck) => {
                if (verificationCheck.status == 'pending') {
                    const message = 'No fue posible validar la OTP'
                    this.logger.error(message)
                    throw new HttpException({
                        status: HttpStatus.NOT_ACCEPTABLE,
                        error: message,
                    }, HttpStatus.NOT_ACCEPTABLE, {
                        cause: Error(message)
                    });
                } else {
                    this.logger.log(`OTP validada correctamente`)
                }
            })
            .catch(err => {
                this.logger.error('Ocurrió un error al intentar validar la OTP')
                throw err;
            });
    }
}
