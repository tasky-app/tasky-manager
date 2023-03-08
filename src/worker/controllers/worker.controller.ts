import {Body, Controller, Get, Headers, HttpException, Logger, Post, Put} from '@nestjs/common';
import {WorkerService} from '../services/worker.service';
import {Worker} from '../../database/entities/Worker';
import {TaskyException} from '../../exceptions/tasky_exception';

@Controller("worker")
export class WorkerController {

    private readonly logger = new Logger(WorkerController.name);

    constructor(private readonly workerService: WorkerService) {
    }

    @Get('services')
    async getWorkerServices(@Headers() headers) {
        this.logger.log("[CC:{}] INICIA CONSULTA DE LOS SERVICIOS DEL PROFESIONAL")
        const services = await this.workerService.getWorkerServices(headers.document_number).catch(err => {
            throw new HttpException('Error', err.status);
        });
        this.logger.log("[CC:{}] FINALIZA CONSULTA DE LOS SERVICIOS DEL PROFESIONAL")
        return services;
    }

    @Post('services')
    async saveWorkerCategories(@Headers() headers, @Body() body) {
        this.logger.log(`[CC:${headers.document_number}] INICIA GUARDADO DE LOS SERVICIOS DEL PROFESIONAL`)
        await this.workerService.saveWorkerServices(headers.document_number, body).catch(err => {
            throw new TaskyException(err.status);
        });
        this.logger.log(`[CC:${headers.document_number}] FINALIZA GUARDADO DE LOS SERVICIOS DEL PROFESIONAL`)
    }

    @Post()
    async saveWorkerInfo(@Headers() headers, @Body() worker: Worker) {
        this.logger.log(`[CC:${headers.document_number}] INICIA GUARDADO DE LOS SERVICIOS DEL PROFESIONAL`)
        await this.workerService.saveWorkerInfo(headers.document_number, worker).catch(err => {
            throw new TaskyException(err.status);
        });
        this.logger.log(`[CC:${headers.document_number}] FINALIZA GUARDADO DE LOS SERVICIOS DEL PROFESIONAL`)
    }

    @Get()
    async getWorkerInfo(@Headers() headers) {
        this.logger.log(`[CC:${headers.document_number}] INICIA GUARDADO DE LOS SERVICIOS DEL PROFESIONAL`)
        const worker = await this.workerService.getWorkerInfo(headers.document_number).catch(err => {
            throw new TaskyException(err.status);
        });
        this.logger.log(`[CC:${headers.document_number}] FINALIZA GUARDADO DE LOS SERVICIOS DEL PROFESIONAL`)
        return worker;
    }

    @Put('status')
    async updateWorkerStatus(@Headers() headers) {
        this.logger.log(`[CC:${headers.document_number}] INICIA ACTUALIZACIÓN DE ESTADO DEL PROFESIONAL`)
        await this.workerService.updateWorkerState(headers.document_number, headers.worker_status).catch(err => {
            throw new TaskyException(err.status);
        });
        this.logger.log(`[CC:${headers.document_number}] FINALIZA ACTUALIZACIÓN DE ESTADO DEL PROFESIONAL`)
    }
}
