import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './User';

@Entity({name: 'clients'})
export class Client {
    @PrimaryGeneratedColumn({name: 'client_id'})
    id: number;

    @OneToOne(() => User)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    userId: User;
}
