import { Client } from "src/database/entities/Client";

export interface IClientService {
    getClientInfo(cellphone: string): Promise<Client>;
}