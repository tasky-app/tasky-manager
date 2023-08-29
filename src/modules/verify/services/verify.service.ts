import { ENotificationChannel } from "../enums/notification_channel";
import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { Twilio } from "twilio";
import configuration from "../../../config/configuration";

const verifySid = configuration().twilio_verify_sid;

@Injectable()
export class VerifyService {
  constructor(@Inject('TwilioClient') private readonly twilioClient: Twilio) {
  }

  private readonly logger = new Logger(VerifyService.name);

  public async sendOtp(channel: ENotificationChannel, recipient: string): Promise<any> {
    const message = "Ocurrió un error al enviar la OTP";

    return this.twilioClient.verify.v2
      .services(verifySid)
      .verifications.create({ to: recipient, channel: channel })
      .then(() => this.logger.log("La OTP se envió correctamente"))
      .catch(err => {
        this.logger.error(message, err);
        throw err;
      });
  }

  public async validateOtp(otp, recipientNumber): Promise<any> {
    return this.twilioClient.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: recipientNumber, code: otp })
      .then((verificationCheck) => {
        if (verificationCheck.status == "pending") {
          const message = "No fue posible validar la OTP";
          this.logger.error(message);
          throw new HttpException({
            status: HttpStatus.NOT_ACCEPTABLE,
            error: message
          }, HttpStatus.NOT_ACCEPTABLE, {
            cause: Error(message)
          });
        } else {
          this.logger.log(`OTP validada correctamente`);
        }
      })
      .catch(err => {
        this.logger.error("Ocurrió un error al intentar validar la OTP");
        throw err;
      });
  }
}
