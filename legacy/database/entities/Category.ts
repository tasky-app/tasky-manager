import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'categories'})
export class Category {
    @PrimaryGeneratedColumn({name: 'category_id'})
    id: number;

    @Column()
    name: string;
}
