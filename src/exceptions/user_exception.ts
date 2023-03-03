import {HttpException} from '@nestjs/common';

export class UserException extends HttpException{
    constructor(message: string, statusCode: number) {
        super(message, statusCode);
    }
}
