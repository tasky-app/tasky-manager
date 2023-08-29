import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { Client } from './Client';
import { Worker } from './Worker';

@Entity({name: 'ratings'})
export class Ratings {
    @PrimaryGeneratedColumn({name: 'rating_id'})
    id: number;

    @Column({name: 'value'})
    value: number;

    @Column()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @ManyToOne(() => Client, (client) => client.id)
    @JoinColumn({name: 'client_id', referencedColumnName: 'id'})
    client: Client;

    @ManyToOne(() => Worker, (worker) => worker.id)
    @JoinColumn({name: 'worker_id', referencedColumnName: 'id'})
    worker: Worker;
}
