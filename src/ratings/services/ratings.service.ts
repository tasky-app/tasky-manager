import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IRatingsService } from "../interfaces/ratings.interface";
import { Ratings } from "src/database/entities/Ratings";
import { Repository } from "typeorm";
import { SaveRatingDto } from "../dto/saveRatingDto";
import { ContractService } from "src/contract/services/contract.service";

@Injectable()
export class RatingsService implements IRatingsService {

    private readonly logger = new Logger(RatingsService.name);

    constructor(
        @InjectRepository(Ratings) private readonly ratingsRepository: Repository<Ratings>,
        @Inject(ContractService) private readonly contractService: ContractService,
    ) {
    }

    async saveWorkerRating(contractId: number, ratingValue: number): Promise<void> {
        const request: SaveRatingDto = await this.getContractInfo(contractId, ratingValue);
        const clientPhone = request.client.user.cellphone;
        const workerPhone = request.worker.user.cellphone;

        this.logger.log(`[CEL: ${clientPhone}] inicia guardado de la calificación del profesional ${workerPhone}`)
        return this.ratingsRepository.save({
            worker: request.worker,
            client: request.client,
            value: request.value,
        }).then(() => {
            this.logger.log(`[CEL: ${clientPhone}] finaliza guardado de la calificación [${request.value}] del profesional ${workerPhone}`)
        }).catch(err => {
            this.logger.error(err);
            throw err;
        });
    }

    private async getContractInfo(contractId: number, ratingValue: number): Promise<SaveRatingDto> {
        return this.contractService.getContractInfoById(contractId).then(contract => {
            const request = new SaveRatingDto();
            request.client = contract.client;
            request.worker = contract.worker;
            request.value = ratingValue;
            return request;
        }).catch(err => {
            this.logger.error(err);
            throw err;
        });
    }
}