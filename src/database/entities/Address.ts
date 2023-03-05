import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ContactInfo} from './ContactInfo';

@Entity({name: 'addresses'})
export class Address {

    @PrimaryGeneratedColumn({name: 'address_id'})
    addressId: number;

    @Column()
    address: string;

    @ManyToOne(() => ContactInfo, (contactInfo) => contactInfo.contactInfoId)
    @JoinColumn({ name: 'contact_info_id' })
    contactInfoId: ContactInfo;
}
