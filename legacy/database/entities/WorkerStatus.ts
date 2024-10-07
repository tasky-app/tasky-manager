import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'worker_status'})
export class WorkerStatus {

    @PrimaryGeneratedColumn({name: 'worker_status_id'})
    id: number;

    @Column({name: 'status_description'})
    statusDescription: string;
}
