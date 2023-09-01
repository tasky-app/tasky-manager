import { Controller, Get, Logger, Headers, Body, Post, Inject } from "@nestjs/common";
import { RatingsService } from "../services/ratings.service";
import { TaskyException } from "src/exceptions/tasky_exception";
import { SaveRatingDto } from "../dto/saveRatingDto";

@Controller("ratings")
export class RatingsController {

    private readonly logger = new Logger(RatingsController.name);

    constructor(private readonly ratingsService: RatingsService) {
    }

    @Post()
    public async saveRating(@Body() request: SaveRatingDto) {
        this.logger.log(`[CONTRACT ID:${request.contractId}] INICIA GUARDADO DE LA CALIFICACIÓN DE LOS SERVICIOS DEL CONTRATO`);
        return this.ratingsService.saveWorkerRating(request).then(() => {
            this.logger.log(`[CONTRACT ID:${request.contractId}] FINALIZA GUARDADO DE LA CALIFICACIÓN DE LOS SERVICIOS DEL CONTRATO`);
        }).catch(err => {
            this.logger.error(err);
            throw new TaskyException(err.status);
        });
    }

    @Get("worker")
    public async getWorkerRating(@Headers() headers) {
        this.logger.log(`[WORKER ID:${headers.cellphone}] INICIA OBTENCIÓN DE LAS CALIFICACIONES DEL PROFESIONAL`);
        return this.ratingsService.getWorkerRating(headers.cellphone).then(response => {
            this.logger.log(`[WORKER ID:${headers.cellphone}] FINALIZA OBTENCIÓN DE LAS CALIFICACIONES DEL PROFESIONAL CON RESULTADO -> ${JSON.stringify(response)}`);
            return response;
        }).catch(err => {
            this.logger.error(err);
            throw new TaskyException(err.status);
        });
    }
}
