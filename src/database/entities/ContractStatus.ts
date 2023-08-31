import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'contracts_status'})
export class ContractStatus {
    @PrimaryGeneratedColumn({name: 'contract_status_id'})
    id: number;
    
    @Column({name: 'status'})
    status: string;
}