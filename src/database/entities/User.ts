import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn({name: 'user_id'})
    id: number;

    @Column({name: 'names'})
    names: string;

    @Column({name: 'last_names'})
    lastNames: string;

    @Column({name: 'document_number', unique: true})
    documentNumber: string;

    @Column({name: 'cellphone', unique: true})
    cellphone: string;

    @Column()
    gender: string;

    @Column()
    email: string;

    @Column({name: 'birth_date'})
    birthDate: Date;

    @Column()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
