import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './User';

@Entity({name: 'addresses'})
export class Address {

    @PrimaryGeneratedColumn({name: 'address_id'})
    id: number;

    @Column()
    address: string;

    @Column()
    neighborhood: string;

    @Column()
    city: string;

    @Column({name: 'main_address'})
    mainAddress: boolean;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    userId: User;
}
