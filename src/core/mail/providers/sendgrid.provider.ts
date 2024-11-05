import * as sgMail from '@sendgrid/mail';

export const SendGridProvider = {
    provide: 'SENDGRID',
    useFactory: () => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        return sgMail;
    },
};
