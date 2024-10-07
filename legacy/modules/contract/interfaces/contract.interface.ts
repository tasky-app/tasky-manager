import { Contract } from "legacy/database/entities/Contract";
import { SaveContractDto } from "../dto/saveContractDto";

export interface IContractService {
    getContractInfoById(contractId: number): Promise<Contract>;
    createContract(request: SaveContractDto): Promise<void>;
    getClientContracts(clientId: number): Promise<Contract[]>;
}