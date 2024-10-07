import { Client } from "legacy/database/entities/Client";

export interface IClientService {
    getClientInfo(cellphone: string): Promise<Client>;
}