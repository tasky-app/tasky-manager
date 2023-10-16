import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/database/entities/Category';
import { Service } from 'src/database/entities/Service';
import { TaskyException } from 'src/exceptions/tasky_exception';

@Injectable()
export class CategoryService {

    private readonly logger = new Logger(CategoryService.name);

    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Service) private readonly serviceRepository: Repository<Service>
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
                throw new TaskyException(HttpStatus.NOT_FOUND, "No existen categorías en base de datos");
            })
            .catch((err) => {
                if (err.status == 404) {
                    throw err;
                }
                throw new TaskyException(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error al consultar las categorías");
            });
    }

    async getServicesByCategory(categoryId: number): Promise<Service[]> {
        this.logger.log("inicia consulta de los servicios por categoria");
        return this.serviceRepository.find({
            select: {
                createdAt: true,
                description: true,
                id: true,
                updatedAt: true
            },
            relations: {
                category: true,
            },
            where: {
                category: {
                    id: categoryId,
                },
            },
        }).then(response => {
            if (response.length > 0) {
                this.logger.log(`finaliza consulta de los servicios por categoria con resultado: ${JSON.stringify(response)}`);
                return response;
            } else {
                throw new TaskyException(HttpStatus.NOT_FOUND, "No se encontraron servicios para esta categoria");
            }
        }).catch((err) => {
            throw err;
        })
    }
}
