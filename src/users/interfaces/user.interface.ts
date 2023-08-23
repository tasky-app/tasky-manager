import { User } from "src/database/entities/User";
import { EUserType } from "../enums/user_type";

export interface IUserService {
    checkUserExists(cellphone: string): Promise<boolean>;
    getUserInfo(documentNumber: string): Promise<User>;
    getUserInfoByCellphone(cellphone: string): Promise<User>;
    saveUser(user: User, userType: EUserType): Promise<void>;
}