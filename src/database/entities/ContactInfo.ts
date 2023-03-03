import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class ContactInfo {

    @PrimaryGeneratedColumn({name: 'contact_info_id'})
    contactInfoId: number;

    @Column()
    email: string;

    @Column()
    address: string;

    @Column()
    neighborhood: string;

    @Column()
    city: string;

    @Column({unique: true})
    cellphone: string;
}
