import { HttpStatus, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { IContractService } from "../interfaces/contract.interface";
import { Contract } from "src/database/entities/Contract";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ContractService implements IContractService {

    private readonly logger = new Logger(ContractService.name);

    constructor(@InjectRepository(Contract) private readonly contractRepository: Repository<Contract>) { }

    getContractInfoById(contractId: number): Promise<Contract> {
        this.logger.log(`[CONTRACT ID: ${contractId}] inicia obtención de la información del contrato`)
        return this.contractRepository.findOneBy({ id: contractId })
            .then(response => {
                this.logger.log(`[CONTRACT ID: ${contractId}] finaliza obtención de la información del contraton con resultado -> ${JSON.stringify(response)}`)
                return response;
            })
            .catch(() => {
                this.logger.error("Ocurrió un error al obtener la información del contrato por id")
                throw new InternalServerErrorException("Error al obtener información de contrato")
            });
    }
}