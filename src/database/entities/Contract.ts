import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Client } from "./Client";
import { Worker } from "./Worker";
import { Service } from "./Service";
import { ContractStatus } from "./ContractStatus";


@Entity({name: 'contracts'})
export class Contract {
    @PrimaryGeneratedColumn({name: 'contract_id'})
    id: number;
    
    @Column()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @Column({name: 'date'})
    contractDate: Date;

    @Column({name: 'estimated_start_hour'})
    estimatedStartHour: Date;

    @Column({name: 'estimated_end_hour'})
    estimatedEndHour: Date;

    @Column({name: 'estimated_time'})
    estimatedTime: Date;

    @Column({name: 'real_start_hour'})
    realStartHour: Date;

    @Column({name: 'real_end_hour'})
    realEndHour: Date;

    @Column({name: 'fee'})
    fee: number;

    @ManyToOne(() => Client, (client) => client.id)
    @JoinColumn({name: 'client_id', referencedColumnName: 'id'})
    client: Client;

    @ManyToOne(() => Worker, (worker) => worker.id)
    @JoinColumn({name: 'worker_id', referencedColumnName: 'id'})
    worker: Worker;

    @ManyToOne(() => Service, (service) => service.id)
    @JoinColumn({name: 'service_id', referencedColumnName: 'id'})
    service: Service;

    @OneToOne(() => ContractStatus) 
    @JoinColumn({name: 'contract_status_id', referencedColumnName: 'id'})
    contractStatus: ContractStatus;
}