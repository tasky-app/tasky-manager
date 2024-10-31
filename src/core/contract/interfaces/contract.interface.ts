import { ECountries } from "src/app/enums/countries";
import { Contracts } from "src/core/firestore/collections/contract";

export interface IContractService {
    executePostContractTasks(contractId: string, country: ECountries): Promise<void>;
    getContractById(contractId: string, country: ECountries): Promise<Contracts>;
}