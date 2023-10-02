import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Category} from './Category';
import { Service } from './Service';

@Entity({name: 'top_services'})
export class TopService {

    @PrimaryGeneratedColumn({name: 'top_service_id'})
    id: number;

    @ManyToOne(() => Service, (service) => service.id)
    @JoinColumn({name: 'service_id', referencedColumnName: 'id'})
    service: Service;

    @Column()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}
