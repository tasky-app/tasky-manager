import { User } from "src/database/entities/User";
import { EUserType } from "../enums/user_type";
import { Category } from "src/database/entities/Category";

export interface IUserService {
    checkUserExists(cellphone: string): Promise<boolean>;
    getUserInfo(documentNumber: string): Promise<User>;
    getUserInfoByCellphone(cellphone: string): Promise<User>;
    saveClient(user: User): Promise<void>;
    saveWorker(user: User, category: Category): Promise<void>
    updateUser(cellphone, user: User): Promise<void>
}