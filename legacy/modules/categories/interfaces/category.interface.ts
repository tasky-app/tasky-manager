import { Category } from "legacy/database/entities/Category";
import { Service } from "legacy/database/entities/Service";

export interface ICategoryService {
    getCategories(): Promise<Category[]>;
    getServicesByCategory(categoryId: number): Promise<Service[]>;
}