import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class ContactInfo {
    @PrimaryGeneratedColumn()
    contactInfoId: number;

    @Column()
    email: string;

    @Column()
    address: string;

    @Column()
    neighborhood: string;

    @Column()
    city: string;

    @Column()
    cellphone: number;
}
