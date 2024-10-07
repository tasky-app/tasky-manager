import { Tasker } from "src/modules/firestore/collections/taskers";

export interface ITaskersService {
    getTaskerById(taskerId: string): Promise<Tasker>;
}