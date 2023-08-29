import { Client } from "src/database/entities/Client";
import { Worker } from "src/database/entities/Worker";

export class SaveRatingDto {
    worker: Worker;
    client: Client;
    value: number;
}