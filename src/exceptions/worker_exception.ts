import {HttpException} from '@nestjs/common';

export class WorkerException extends HttpException{
    constructor(message: string, statusCode: number) {
        super(message, statusCode);
    }
}
