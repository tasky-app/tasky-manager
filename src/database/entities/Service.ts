import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Category} from './Category';

@Entity({name: 'services'})
export class Service {

    @PrimaryGeneratedColumn({name: 'service_id'})
    id: number;

    @ManyToOne(() => Category, (category) => category.categoryId)
    @JoinColumn({name: 'category_id', referencedColumnName: 'categoryId'})
    category: Category;

    @Column({name: 'created_at'})
    createdAt: Date;

    @Column({name: 'updated_at'})
    updatedAt: Date;

    @Column()
    description: string;
}