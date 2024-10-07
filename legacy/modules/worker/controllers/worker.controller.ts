import { Body, Controller, Get, Headers, HttpException, Logger, Post, Put } from '@nestjs/common';
import { WorkerService } from '../services/worker.service';
import { TaskyException } from 'src/exceptions/tasky_exception';
import { Worker } from 'legacy/database/entities/Worker';

@Controller("worker")
export class WorkerController {

    private readonly logger = new Logger(WorkerController.name);

    constructor(private readonly workerService: WorkerService) {
    }

    @Get('services')
    async getWorkerServices(@Headers() headers) {
        this.logger.log(`[CEL:${headers.cellphone}] INICIA CONSULTA DE LOS SERVICIOS DEL PROFESIONAL`)
        const services = await this.workerService.getWorkerServices(headers.cellphone).catch(err => {
            throw new HttpException('Error', err.status);
        });
        this.logger.log(`[CEL:${headers.cellphone}] FINALIZA CONSULTA DE LOS SERVICIOS DEL PROFESIONAL`)
        return services;
    }

    @Post('services')
    async saveWorkerServices(@Headers() headers, @Body() body) {
        this.logger.log(`[CEL:${headers.cellphone}] INICIA GUARDADO DE LOS SERVICIOS DEL PROFESIONAL`)
        await this.workerService.saveWorkerServices(headers.cellphone, body).catch(err => {
            throw new TaskyException(err.status);
        });
        this.logger.log(`[CEL:${headers.cellphone}] FINALIZA GUARDADO DE LOS SERVICIOS DEL PROFESIONAL`)
    }

    @Post()
    async saveAdditionalInfo(@Headers() headers, @Body() worker: Worker) {
        this.logger.log(`[CEL:${headers.cellphone}] INICIA GUARDADO DE LA INFORMACIÓN ADICIONAL DEL PROFESIONAL`)
        await this.workerService.saveWorkerInfo(headers.cellphone, worker).catch(err => {
            throw new TaskyException(err.status);
        });
        this.logger.log(`[CEL:${headers.cellphone}] FINALIZA GUARDADO DE LA INFORMACIÓN ADICIONAL DEL PROFESIONAL`)
    }

    @Get()
    async getWorkerInfo(@Headers() headers) {
        this.logger.log(`[CEL:${headers.cellphone}] INICIA GUARDADO DE LOS SERVICIOS DEL PROFESIONAL`)
        const worker = await this.workerService.getWorkerInfo(headers.cellphone).catch(err => {
            throw new TaskyException(err.status);
        });
        this.logger.log(`[CEL:${headers.cellphone}] FINALIZA GUARDADO DE LOS SERVICIOS DEL PROFESIONAL`)
        return worker;
    }

    @Put('status')
    async updateWorkerStatus(@Headers() headers) {
        this.logger.log(`[CEL:${headers.cellphone}] INICIA ACTUALIZACIÓN DE ESTADO DEL PROFESIONAL`)
        await this.workerService.updateWorkerState(headers.cellphone, headers.worker_status).catch(err => {
            throw new TaskyException(err.status);
        });
        this.logger.log(`[CEL:${headers.cellphone}] FINALIZA ACTUALIZACIÓN DE ESTADO DEL PROFESIONAL`)
    }

    // TODO PENDING
    @Get("top")
    async getTopWorkers(@Headers() headers) {
        this.logger.log(`INICIA OBTENCIÓN DE LOS PROFESIONALES DESTACADOS`)
        const workers = await this.workerService.getTopWorkers(headers.cellphone).catch(err => {
            throw new TaskyException(err.status);
        });
        this.logger.log(`[CEL:${headers.cellphone}] FINALIZA OBTENCIÓN DE LOS PROFESIONALES DESTACADOS`)
        return workers;
    }

    @Get("by-service")
    async getWorkersByService(@Headers() headers) {
        this.logger.log(`[CEL:${headers.cellphone}] INICIA OBTENCIÓN DE LOS PROFESIONALES DEL SERVICIO: ${headers.service_id}`)
        const workers = await this.workerService.getWorkersByService(headers.service_id).catch(err => {
            throw new TaskyException(err.status);
        });
        this.logger.log(`[CEL:${headers.cellphone}] FINALIZA OBTENCIÓN DE LOS PROFESIONALES DEL SERVICIO: ${headers.service_id} CON RESULTADO -> ${JSON.stringify(workers)}`)
        return workers;
    }
}
