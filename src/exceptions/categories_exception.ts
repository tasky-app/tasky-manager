import {HttpException} from '@nestjs/common';

export class CategoriesException extends HttpException{
    constructor(message: string, statusCode: number) {
        super(message, statusCode);
    }
}
