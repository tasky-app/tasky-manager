import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './User';

@Entity({name: 'addresses'})
export class Address {

    @PrimaryGeneratedColumn({name: 'address_id'})
    addressId: number;

    @Column()
    address: string;

    @Column()
    neighborhood: string;

    @Column()
    city: string;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    userId: User;
}
