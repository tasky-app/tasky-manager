import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { SendEmailDto } from '../dto/send-email.dto';

@Controller('email')
export class EmailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send')
    async sendEmail(@Body() sendEmailDto: SendEmailDto) {
        return this.mailService.sendEmail(sendEmailDto);
    }
}
