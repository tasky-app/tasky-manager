export interface IPasswordService {
    validatePassword(cellphone: string, password: string): Promise<void>;
    savePassword(cellphone: string, password: string) : Promise<void>;
}