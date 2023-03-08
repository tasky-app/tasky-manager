import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Worker} from '../../database/entities/Worker';
import {Repository} from 'typeorm';
import {WorkerServices} from '../../database/entities/WorkerServices';
import {WorkerException} from '../../exceptions/worker_exception';
import {Service} from '../../database/entities/Service';
import {EWorkerStatus} from '../enums/worker_status_enum';
import {WorkerStatus} from '../../database/entities/WorkerStatus';

@Injectable()
export class WorkerService {

    private readonly logger = new Logger(WorkerService.name);

    constructor(@InjectRepository(Worker) private readonly workerRepository: Repository<Worker>,
                @InjectRepository(WorkerServices) private readonly workerServicesRepository: Repository<WorkerServices>,
                @InjectRepository(WorkerStatus) private readonly workerStatusRepository: Repository<WorkerStatus>) {
    }

    async getWorkerServices(documentNumber: string) {
        this.logger.log(`[CC: ${documentNumber}] inicia consulta de las servicios asociados al profesional`)
        return this.workerServicesRepository.createQueryBuilder("worker_services")
            .leftJoinAndSelect("worker_services.worker", "worker")
            .leftJoinAndSelect("worker_services.service", "service")
            .leftJoinAndSelect("worker.userId", "user")
            .where("user.document_number = :documentNumber", {documentNumber: documentNumber})
            .select("service.description", "name")
            .getRawMany()
            .then(response => {
                if (response.length > 0) {
                    this.logger.log(`[CC: ${documentNumber}] finaliza consulta de los servicios asociados al profesional con resultado: ${JSON.stringify(response)}`)
                    return response;
                } else {
                    const msg = `[CC: ${documentNumber}] el profesional no tiene servicios asignados`
                    this.logger.error(msg);
                    throw new WorkerException(msg, HttpStatus.NOT_ACCEPTABLE);
                }
            })
            .catch(err => {
                this.logger.error(err);
                throw err;
            });
    }

    async saveWorkerServices(documentNumber: string, services: Service[]) {
        this.logger.log(`[CC: ${documentNumber}] inicia guardado del servicio del profesional`)
        const worker = await this.getWorkerInfo(documentNumber);
        for (const service of services) {
            const workerServices = new WorkerServices();
            workerServices.worker = worker;
            workerServices.service = service;
            await this.workerServicesRepository.save(workerServices)
                .then(() => {
                    this.logger.log(`[CC: ${documentNumber}] finaliza guardado del servicio del profesional - Services: ${JSON.stringify(service)}`);
                })
                .catch(err => {
                    const msg = `[CC: ${documentNumber} Ocurrió un error al guardar del servicio del profesional - Services: ${JSON.stringify(service)}]`
                    this.logger.error(msg, err);
                    throw new WorkerException(msg, HttpStatus.INTERNAL_SERVER_ERROR)
                });
        }
    }

    async getWorkerInfo(documentNumber: string) {
        this.logger.log(`[CC: ${documentNumber}] inicia obtención de la información del profesional`)
        return this.workerRepository.find({
            relations: {
                user: true,
            },
            where: {
                user: {
                    documentNumber: documentNumber,
                },
            },
        }).then(response => {
            this.logger.log(`[CC: ${documentNumber}] finaliza obtención de la información del profesional con resultado: ${JSON.stringify(response)}`)
            return response[0];
        }).catch(err => {
            const msg = `[CC: ${documentNumber}] ocurrió un error al obtener la información del profesional ${JSON.stringify(err)}`
            this.logger.error(msg, err)
            throw new WorkerException(msg, HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    async saveWorkerInfo(documentNumber: string, worker: Worker) {
        this.logger.log(`[CC: ${documentNumber}] inicia guardado de la información del profesional`)
        const workerInfo = await this.mapWorkerInfo(documentNumber, worker);
        await this.saveWorkerInBd(workerInfo);
    }

    async updateWorkerState(documentNumber: string, status: EWorkerStatus) {
        this.logger.log(`[CC: ${documentNumber}] inicia actualización del estado del profesional`)
        const workerInfo = await this.getWorkerInfo(documentNumber);
        workerInfo.workerStatus = await this.getWorkerStatus(status);
        await this.saveWorkerInBd(workerInfo);
        this.logger.log(`[CC: ${documentNumber}] finaliza actualización del estado del profesional`)
    }

    private async saveWorkerInBd(worker: Worker) {
        this.workerRepository.save(worker)
            .then(() => {
                this.logger.log(`[CC: ${worker.user.documentNumber}] finaliza guardado de la información del profesional`)
            })
            .catch(err => {
                const msg = `[CC: ${worker.user.documentNumber}] ocurrió un error al guardar la información del profesional ${JSON.stringify(err)}`
                this.logger.error(msg, err)
                throw new WorkerException(msg, HttpStatus.INTERNAL_SERVER_ERROR)
            });
    }

    private getWorkerStatus(status: EWorkerStatus) {
        return this.workerStatusRepository.findOne({
            where: {
                statusDescription: status,
            },
        }).then(res => {
            if (res === null) {
                throw new WorkerException(`Ocurrió un error al obtener el estado`, HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return res;
        }).catch(err => {
            this.logger.error(err.message, err)
            throw new WorkerException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        })
    }

    private async mapWorkerInfo(documentNumber: string, worker: Worker) {
        const workerInfo = await this.getWorkerInfo(documentNumber);
        workerInfo.fee = worker.fee;
        workerInfo.startHour = worker.startHour;
        workerInfo.finalHour = worker.finalHour;
        workerInfo.ownVehicle = worker.ownVehicle;
        workerInfo.experience = worker.experience;
        return workerInfo;
    }
}
