import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {User} from './User';
import {WorkerStatus} from './WorkerStatus';

@Entity()
export class Worker {

    @PrimaryGeneratedColumn({name: 'worker_id'})
    id: number;

    @Column({nullable: true})
    fee: number;

    @Column({name: 'is_certified', nullable: true})
    isCertified: boolean;

    @OneToOne(() => WorkerStatus)
    @JoinColumn({name: 'worker_status_id', referencedColumnName: 'id'})
    workerStatusId: WorkerStatus;

    @OneToOne(() => User)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    userId: User;

    @Column()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
