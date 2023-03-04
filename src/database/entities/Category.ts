import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'categories'})
export class Category {
    @PrimaryGeneratedColumn({name: 'category_id'})
    categoryId: number;

    @Column()
    name: string;
}
