import { Category } from "src/database/entities/Category";
import { Service } from "src/database/entities/Service";

export interface ICategoryService {
    getCategories(): Promise<Category[]>;
    getServicesByCategory(categoryId: number): Promise<Service[]>;

}