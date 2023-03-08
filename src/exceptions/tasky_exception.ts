import {HttpException} from '@nestjs/common';

export class TaskyException extends HttpException {

    constructor(statusCode: number) {
        super("Ha ocurrido un error", statusCode);
    }
}
