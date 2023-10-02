import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";

@Entity({name: 'feedback'})
export class Feedback {
    @PrimaryGeneratedColumn({name: 'feedback_id'})
    id: number;

    @ManyToOne(() => Client, (client) => client.id)
    @JoinColumn({name: 'client_id', referencedColumnName: 'id'})
    client: Client;

    @Column({name: 'comment'})
    comment: string;

    @Column()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;
}