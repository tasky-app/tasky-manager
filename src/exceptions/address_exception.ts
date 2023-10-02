import {HttpException} from '@nestjs/common';

export class AddressException extends HttpException{
    constructor(message: string, statusCode: number) {
        super(message, statusCode);
    }
}
