import {HttpException} from '@nestjs/common';

export class TaskyException extends HttpException {

    constructor(statusCode: number, message: string = "Ha ocurrido un error") {
        super(message, statusCode);
    }
}
