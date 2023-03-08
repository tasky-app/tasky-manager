import {Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Worker} from './Worker';
import {Service} from './Service';

@Entity({name: 'worker_services'})
export class WorkerServices {

    @PrimaryGeneratedColumn({name: 'worker_services_id'})
    id: number;

    @ManyToOne(() => Worker, (worker) => worker.id)
    @JoinColumn({name: 'worker_id', referencedColumnName: 'id'})
    worker: Worker;

    @ManyToOne(() => Service, (service) => service.id)
    @JoinColumn({name: 'service_id', referencedColumnName: 'id'})
    service: Service;
}
