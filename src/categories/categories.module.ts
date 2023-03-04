import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoryController} from './controllers/category.controller';
import {CategoryService} from './services/category.service';
import {Category} from '../database/entities/Category';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [CategoryService],
    controllers: [CategoryController]
})

export class CategoriesModule {
}
