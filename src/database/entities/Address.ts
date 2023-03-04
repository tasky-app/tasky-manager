import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ContactInfo} from './ContactInfo';

@Entity()
export class Address {

    @PrimaryGeneratedColumn({name: 'address_id'})
    addressId: number;

    @Column()
    address: string;

    @OneToOne(() => ContactInfo)
    @JoinColumn({name: 'contact_info_id', referencedColumnName: 'contactInfoId'})
    contactInfoId: ContactInfo;
}
