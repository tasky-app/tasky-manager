import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './User';

@Entity({name: 'password'})
export class Password {
    @PrimaryGeneratedColumn({name: 'password_id'})
    id: number;

    @Column({name: 'password'})
    password: string;

    @OneToOne(() => User)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    userId: User;
}
