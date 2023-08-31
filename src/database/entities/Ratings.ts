import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { Worker } from './Worker';
import { Contract } from './Contract';

@Entity({name: 'ratings'})
export class Ratings {
    @PrimaryGeneratedColumn({name: 'rating_id'})
    id: number;

    @Column({name: 'value'})
    value: number;

    @Column()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @OneToOne(() => Contract)
    @JoinColumn({name: 'contract_id', referencedColumnName: 'id'})
    contract: Contract;
}
