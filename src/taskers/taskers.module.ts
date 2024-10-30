import { Module } from '@nestjs/common';
import { TaskersController } from './taskers.controller';
import { TaskersService } from './taskers.service';

@Module({
    controllers: [TaskersController],
    providers: [TaskersService],
})
export class TaskersModule { }
