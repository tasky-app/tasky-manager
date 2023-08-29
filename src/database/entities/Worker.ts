import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {User} from './User';
import {WorkerStatus} from './WorkerStatus';
import { Category } from './Category';

@Entity()
export class Worker {

    @PrimaryGeneratedColumn({name: 'worker_id'})
    id: number;

    @Column({nullable: true})
    fee: number;

    @Column({name: 'start_hour', nullable: true})
    startHour: string;

    @Column({name: 'final_hour', nullable: true})
    finalHour: string;

    @Column({name: 'own_vehicle', nullable: true})
    ownVehicle: boolean;

    @Column({nullable: true})
    experience: number;

    @OneToOne(() => WorkerStatus)
    @JoinColumn({name: 'worker_status_id', referencedColumnName: 'id'})
    workerStatus: WorkerStatus;

    @OneToOne(() => User)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: User;

    @OneToOne(() => Category)
    @JoinColumn({name: 'category_id', referencedColumnName: 'id'})
    category: Category;

    @Column()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
