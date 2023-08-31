import { HttpStatus, Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { IContractService } from "../interfaces/contract.interface";
import { Contract } from "src/database/entities/Contract";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SaveContractDto } from "../dto/saveContractDto";
import { ClientService } from "src/modules/client/services/client.service";
import { WorkerService } from "src/modules/worker/services/worker.service";
import { ServicesService } from "src/modules/services/services/services.service";
import { AddressService } from "src/modules/address/services/address.service";
import { ContractStatus } from "src/database/entities/ContractStatus";
import { EContractStatus } from "../enums/contractStatus";

const HOUR_IN_MINUTES = 60;
@Injectable()
export class ContractService implements IContractService {

    private readonly logger = new Logger(ContractService.name);

    constructor(
        @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
        @InjectRepository(ContractStatus) private readonly contractStatusRepository: Repository<ContractStatus>,
        private readonly addressService: AddressService,
        private readonly serviceService: ServicesService,
        private readonly workerService: WorkerService,
        private readonly clientService: ClientService
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
            const address = await this.addressService.getAddressById(request.addressId);
            const contractStatus = await this.getContractStatus(EContractStatus.PENDING);
            const estimatedStartHour = new Date(request.estimatedStartHour);
            const estimatedContractHours = request.estimatedTime / HOUR_IN_MINUTES;
            const endHour = estimatedStartHour;
            endHour.setHours(estimatedStartHour.getHours() + estimatedContractHours);

            contract.client = client;
            contract.worker = worker;
            contract.service = service;
            contract.address = address;
            contract.estimatedEndHour = endHour;
            contract.estimatedStartHour = request.estimatedStartHour;
            contract.estimatedTime = request.estimatedTime;
            contract.fee = worker.fee;
            contract.contractDate = request.contractDate;
            contract.contractStatus = contractStatus;
            this.logger.log(`[CLIENT CEL:${request.clientId}] finaliza la construcción del contrato con resultado -> ${JSON.stringify(contract)}`)
            return contract;
        } catch (err) {
            this.logger.error(err.message);
            throw err;
        }
    }

    private async getContractStatus(contractStatus: EContractStatus): Promise<ContractStatus> {
        this.logger.log(`[CONTRACT STATUS: ${contractStatus}] inicia obtención del estado del contrato`)
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
        return this.contractRepository.findOne({
            where: { id: contractId },
            relations: {
                client: { user: true },
                worker: { user: true },
                address: true,
                contractStatus: true,
                service: true,
            }
        })
            .then(response => {
                this.logger.log(`[CONTRACT ID: ${contractId}] finaliza obtención de la información del contrato con resultado -> ${JSON.stringify(response)}`)
                return response;
            })
            .catch(() => {
                this.logger.error("Ocurrió un error al obtener la información del contrato por id")
                throw new InternalServerErrorException("Error al obtener información de contrato")
            });
    }

}