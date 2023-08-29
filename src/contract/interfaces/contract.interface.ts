import { Contract } from "src/database/entities/Contract";

export interface IContractService {
    getContractInfoById(contractId: number): Promise<Contract>;
}