import { Controller, Get, Headers, Logger } from "@nestjs/common";
import { CategoryService } from '../services/category.service';

@Controller("category")
export class CategoryController {

    private readonly logger = new Logger(CategoryController.name);

    constructor(private readonly categoryService: CategoryService) {
    }

    //OK - 27/08/2023
    @Get()
    public async getCategories() {
        this.logger.log(`INICIA OBTENCIÓN DE LAS CATEGORÍAS`);
        const categories = this.categoryService.getCategories();
        this.logger.log(`FINALIZA OBTENCIÓN DE LAS CATEGORÍAS`);
        return categories;
    }

    //OK - 27/08/2023
    @Get("services")
    public async getServicesByCategory(@Headers() headers) {
        this.logger.log(`INICIA OBTENCIÓN DE LOS SERVICIOS DE LA CATEGORÍA CON ID ${headers.category_id}`);
        return this.categoryService.getServicesByCategory(headers.category_id)
            .then((services) => {
                this.logger.log(`INICIA OBTENCIÓN DE LOS SERVICIOS DE LA CATEGORÍA CON ID ${headers.category_id}`);
                return services;
            })
            .catch(err => {
                throw err;
            });
    }
}
