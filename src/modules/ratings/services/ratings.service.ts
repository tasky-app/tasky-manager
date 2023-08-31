import { ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IRatingsService } from "../interfaces/ratings.interface";
import { Ratings } from "src/database/entities/Ratings";
import { Repository } from "typeorm";
import { ContractService } from "src/modules/contract/services/contract.service";

@Injectable()
export class RatingsService implements IRatingsService {

    private readonly logger = new Logger(RatingsService.name);

    constructor(
        @InjectRepository(Ratings) private readonly ratingsRepository: Repository<Ratings>,
        private readonly contractService: ContractService,
    ) {
    }

    async saveWorkerRating(contractId: number, ratingValue: number): Promise<void> {
        if (await this.checkPreviousRating(contractId)) {
            throw new ConflictException("Ya se ha calificado este servicio");
        } else {
            return this.contractService.getContractInfoById(contractId).then(contract => {
                const clientPhone = contract.client.user.cellphone;
                const workerPhone = contract.worker.user.cellphone;

                this.logger.log(`[CEL: ${clientPhone}] inicia guardado de la calificación del profesional -> ${workerPhone}`)
                const rating: Ratings = new Ratings();
                rating.contract = contract;
                rating.value = ratingValue;

                return this.ratingsRepository.save(rating)
                    .then(() => {
                        this.logger.log(`[CEL: ${clientPhone}] finaliza guardado de la calificación [${ratingValue}] del profesional -> ${workerPhone}`)
                    })
                    .catch(() => {
                        throw new InternalServerErrorException("Error al guardar la calificación");
                    });
            }).catch(err => {
                this.logger.error(err);
                throw err;
            });
        }
    }

    private async checkPreviousRating(contractId: number): Promise<boolean> {
        this.logger.log(`[CONTRACT ID: ${contractId}] inicia validación de calificación previa`)

        const hasRating = await this.ratingsRepository.findOne({
            where: {
                contract: { id: contractId },
            },
        });

        this.logger.log(`[CONTRACT ID: ${contractId}] finaliza validación de calificación previa con resultado -> ${hasRating != null}`)
        return hasRating != null;
    }

}