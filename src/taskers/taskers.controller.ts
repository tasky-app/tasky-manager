import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TaskersService } from './taskers.service';

@Controller('taskers')
export class TaskersController {
    constructor(private readonly taskersService: TaskersService) { }

   
}
