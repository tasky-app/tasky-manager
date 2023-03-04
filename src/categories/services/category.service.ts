import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Category} from '../../database/entities/Category';
import {CategoriesException} from '../../exceptions/categories_exception';

@Injectable()
export class CategoryService {

    private readonly logger = new Logger(CategoryService.name);

    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
    ) {
    }

    async getCategories() {
        this.logger.log("inicia consulta de las categorías");
        return this.categoryRepository.find()
            .then(categories => {
                if (categories != null && categories.length > 0) {
                    this.logger.log(`finaliza consulta de las categorías con resultado: ${JSON.stringify(categories)}`);
                    return categories;
                }
                throw new CategoriesException("No existen categorías en base de datos", HttpStatus.NOT_FOUND);
            })
            .catch((err) => {
                if (err.status == 404) {
                    throw err;
                }
                throw new CategoriesException("Ocurrió un error al consultar las categorías", HttpStatus.INTERNAL_SERVER_ERROR);
            });
    }
}
