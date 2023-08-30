import { HttpStatus, Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { IContractService } from "../interfaces/contract.interface";
import { Contract } from "src/database/entities/Contract";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SaveContractDto } from "../dto/saveContractDto";
import { ClientService } from "src/modules/client/services/client.service";
import { WorkerService } from "src/modules/worker/services/worker.service";
import { ServicesService } from "src/modules/services/services/services.service";
import { ContractStatus } from "src/database/entities/ContractStatus";
import { EContractStatus } from "../enums/contractStatus";

@Injectable()
export class ContractService implements IContractService {

    private readonly logger = new Logger(ContractService.name);

    constructor(
        @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
        @InjectRepository(ContractStatus) private readonly contractStatusRepository: Repository<ContractStatus>,
        @Inject() private readonly clientService: ClientService,
        @Inject() private readonly workerService: WorkerService,
        @Inject() private readonly serviceService: ServicesService,
    ) { }

    async createContract(request: SaveContractDto): Promise<void> {
        const contract: Contract = await this.buildContract(request);
        this.logger.log(`[CLIENT CEL:${request.clientId}] inicia el guardado del contrato`)
        this.contractRepository.save(contract).then(() => {
            this.logger.log(`[CLIENT CEL:${request.clientId}] finaliza el guardado del contrato`)
        }).catch(err => {
            this.logger.error(err.message);
            throw new InternalServerErrorException("Error al crear el contrato");
        });
    }

    private async buildContract(request: SaveContractDto): Promise<Contract> {
        try {
            this.logger.log(`[CLIENT CEL:${request.clientId}] inicia la construcción del contrato`)
            const contract = new Contract();

            const client = await this.clientService.getClientInfo(request.clientId.toString());
            const worker = await this.workerService.getWorkerInfo(request.workerId.toString());
            const service = await this.serviceService.getServiceById(request.serviceId);
            const endHour = new Date(request.estimatedStartHour.getHours() + request.estimatedTime.getHours());

            contract.client = client;
            contract.worker = worker;
            contract.service = service;
            contract.estimatedEndHour = endHour;
            contract.estimatedStartHour = request.estimatedStartHour;
            contract.estimatedTime = request.estimatedTime;
            contract.fee = worker.fee;
            contract.contractDate = request.contractDate;
            contract.contractStatus = await this.getContractStatus(EContractStatus.PENDING);
            this.logger.log(`[CLIENT CEL:${request.clientId}] finaliza la construcción del contrato con resultado -> ${JSON.stringify(contract)}`)
            return contract;
        } catch (err) {
            this.logger.error(err.message);
            throw err;
        }
    }

    private getContractStatus(contractStatus: EContractStatus) {
        return this.contractStatusRepository.findOneBy({ status: contractStatus }).then(response => {
            this.logger.log(`[CONTRACT STATUS: ${contractStatus}] finaliza obtención del estado del contrato con resultado -> ${JSON.stringify(response)}`);
            return response;
        }).catch(err => {
            this.logger.error("Ocurrió un error al obtener la información del estado del contrato de base de datos");
            throw err;
        });
    }

    async getContractInfoById(contractId: number): Promise<Contract> {
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