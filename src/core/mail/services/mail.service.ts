import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { SendEmailDto } from '../dto/send-email.dto';

@Injectable()
export class MailService {

    constructor(@Inject('SENDGRID') private readonly sendGrid) { }

    async sendEmail(sendEmailDto: SendEmailDto, attachments?: { filename: string; content: Buffer }[]) {
        const { to, subject, text, html } = sendEmailDto;

        if (!to || !subject || !text) {
            throw new BadRequestException('Los campos "to", "subject" y "text" son obligatorios');
        }

        if (!this.isValidEmail(to)) {
            throw new BadRequestException('El campo "to" debe ser un email válido');
        }

        const msg: MailDataRequired = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject,
            text,
            html,
            attachments: attachments?.map(att => ({
                filename: att.filename,
                content: att.content.toString('base64'), 
                type: 'application/pdf', 
                disposition: 'attachment',
            })),
        };

        try {
            await this.sendGrid.send(msg);
            console.log('Email sent successfully');
            return { message: 'Email enviado exitosamente' };
        } catch (error) {
            console.error('Error sending email:', error);
            if (error.response) {
                console.error(error.response.body);
            }
            throw new BadRequestException('No se pudo enviar el email. Por favor, inténtalo de nuevo.');
        }
    }

    // Método auxiliar para validar el formato de email
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
