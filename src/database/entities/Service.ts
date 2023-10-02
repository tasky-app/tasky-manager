import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Category} from './Category';

@Entity({name: 'services'})
export class Service {

    @PrimaryGeneratedColumn({name: 'service_id'})
    id: number;

    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({name: 'category_id', referencedColumnName: 'id'})
    category: Category;
    
    @Column()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @Column()
    description: string;
}
