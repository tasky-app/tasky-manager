import { Module } from '@nestjs/common';
import { MailService } from '../mail/services/mail.service';
import { SendGridProvider } from '../mail/providers/sendgrid.provider';
import { EmailController } from './controllers/sendgrid.controller';

@Module({
    controllers: [EmailController],
    providers: [MailService, SendGridProvider],
    exports: [MailService],
})
export class MailModule { }
