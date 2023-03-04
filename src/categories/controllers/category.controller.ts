import {Controller, Get, Headers, Logger} from "@nestjs/common";
import { CategoryService} from '../services/category.service';

@Controller("category")
export class CategoryController {

    private readonly logger = new Logger(CategoryController.name);

    constructor(private readonly categoryService: CategoryService) {
    }

    @Get()
    public async getCategories(@Headers() headers) {
        this.logger.log(`INICIA OBTENCIÓN DE LAS CATEGORÍAS`);
        const categories = this.categoryService.getCategories();
        this.logger.log(`FINALIZA OBTENCIÓN DE LAS CATEGORÍAS`);
        return categories;
    }


}
