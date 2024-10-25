export interface ICloudTasksService {
    createContractTimeoutTask(contractId: string): Promise<void>;
    deleteContractTimeoutTask(contractId: string): Promise<void>;
}