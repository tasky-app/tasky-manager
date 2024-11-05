import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
    @IsEmail()
    @IsNotEmpty()
    readonly to: string;

    @IsString()
    @IsNotEmpty()
    readonly subject: string;

    @IsString()
    @IsNotEmpty()
    readonly text: string;

    @IsString()
    @IsOptional()
    readonly html?: string;
}
