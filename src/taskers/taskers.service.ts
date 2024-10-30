import { Injectable } from '@nestjs/common';
import { Tasker } from 'src/modules/firestore/collections/taskers';

@Injectable()
export class TaskersService {
    
    private taskers: Tasker[] = [];

    
}
