import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoryController} from './controllers/category.controller';
import {CategoryService} from './services/category.service';
import {Category} from '../database/entities/Category';
import {Service} from '../database/entities/Service';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Service])],
    providers: [CategoryService],
    controllers: [CategoryController]
})

export class CategoriesModule {
}
