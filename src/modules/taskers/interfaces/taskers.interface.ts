import { ECountries } from "src/app/enums/countries";
import { Tasker } from "src/modules/firestore/collections/taskers";

export interface ITaskersService {
    getTaskerById(taskerId: string, country: ECountries): Promise<Tasker>;
}