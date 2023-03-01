import {ContactInfo} from './ContactInfo';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn({name: 'user_id'})
    id: number;

    @Column({name: 'names'})
    names: string;

    @Column({name: 'last_names'})
    lastNames: string;

    @Column({name: 'document_number', unique: true})
    documentNumber: string;

    @Column()
    gender: string;

    @Column({name: 'birth_date'})
    birthDate: Date;

    @OneToOne(() => ContactInfo)
    @JoinColumn({name: 'contact_info_id', referencedColumnName: 'contactInfoId'})
    contactInfoId: ContactInfo;

    @Column()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
