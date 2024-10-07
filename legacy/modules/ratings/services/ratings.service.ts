import { ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IRatingsService } from "../interfaces/ratings.interface";
import { Ratings } from "legacy/database/entities/Ratings";
import { Repository } from "typeorm";
import { ContractService } from "legacy/modules/contract/services/contract.service";
import { SaveRatingDto } from "../dto/saveRatingDto";

@Injectable()
export class RatingsService implements IRatingsService {

    private readonly logger = new Logger(RatingsService.name);

    constructor(
        @InjectRepository(Ratings) private readonly ratingsRepository: Repository<Ratings>,
        private readonly contractService: ContractService,
    ) {
    }

    async getWorkerRating(workerId: number): Promise<Ratings[]> {
        this.logger.log(`[WORKER ID: ${workerId}] inicia obtención de las calificaciones del profesional`)
        return this.ratingsRepository.find({
            where: {
                contract: {
                    worker: {
                        user: {
                            cellphone: workerId.toString(),
                        },
                    },
                },
            },
        }).then(response => {
            this.logger.log(`[WORKER ID: ${workerId}] finaliza obtención de las calificaciones del profesional con resultado -> ${JSON.stringify(response)}`)
            return response;
        }).catch(err => {
            this.logger.error(err);
            throw new InternalServerErrorException("Error al obtener las calificaciones del profesional");
        });
    }

    async saveWorkerRating(request: SaveRatingDto): Promise<void> {
        if (await this.checkPreviousRating(request.contractId)) {
            throw new ConflictException("Ya se ha calificado este servicio");
        } else {
            return this.contractService.getContractInfoById(request.contractId).then(contract => {
                const clientPhone = contract.client.user.cellphone;
                const workerPhone = contract.worker.user.cellphone;

                this.logger.log(`[CEL: ${clientPhone}] inicia guardado de la calificación del profesional -> ${workerPhone}`)
                const rating: Ratings = new Ratings();
                rating.contract = contract;
                rating.value = request.ratingValue;
                rating.comment = request.comment;

                return this.ratingsRepository.save(rating)
                    .then(() => {
                        this.logger.log(`[CEL: ${clientPhone}] finaliza guardado de la calificación [${request.ratingValue}] del profesional -> ${workerPhone}`)
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