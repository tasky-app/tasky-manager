import { Controller, Get, Logger, Headers, Body, Post, Inject } from "@nestjs/common";
import { RatingsService } from "../services/ratings.service";
import { TaskyException } from "src/exceptions/tasky_exception";

@Controller("ratings")
export class RatingsController {

    private readonly logger = new Logger(RatingsController.name);

    constructor(private readonly ratingsService: RatingsService) {
    }

    @Post()
    public async saveRating(@Headers() headers) {
        this.logger.log(`[CONTRACT ID:${headers.contract_id}] INICIA GUARDADO DE LA CALIFICACIÓN DE LOS SERVICIOS DEL CONTRATO`);
        return this.ratingsService.saveWorkerRating(headers.contract_id, headers.rating_value).then(() => {
            this.logger.log(`[CONTRACT ID:${headers.contract_id}] FINALIZA GUARDADO DE LA CALIFICACIÓN DE LOS SERVICIOS DEL CONTRATO`);
        }).catch(err => {
            this.logger.error(err);
            throw new TaskyException(err.status);
        });
    }
}
