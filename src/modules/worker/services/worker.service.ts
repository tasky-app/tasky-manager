import { Injectable, Logger, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ratings } from "src/database/entities/Ratings";
import { Service } from "src/database/entities/Service";
import { Worker } from "src/database/entities/Worker";
import { WorkerServices } from "src/database/entities/WorkerServices";
import { WorkerStatus } from "src/database/entities/WorkerStatus";
import { WorkerException } from "src/exceptions/worker_exception";
import { Repository } from "typeorm";
import { EWorkerStatus } from "../enums/worker_status_enum";
import { IWorkerService } from "../interfaces/worker.interface";


@Injectable()
export class WorkerService implements IWorkerService {

    private readonly logger = new Logger(WorkerService.name);

    constructor(
        @InjectRepository(Worker) private readonly workerRepository: Repository<Worker>,
        @InjectRepository(WorkerServices) private readonly workerServicesRepository: Repository<WorkerServices>,
        @InjectRepository(WorkerStatus) private readonly workerStatusRepository: Repository<WorkerStatus>,
        @InjectRepository(Ratings) private readonly ratingsRepository: Repository<Ratings>,
        
    ) {
    }
    
    getWorkersByService(serviceId: number): Promise<Worker[]> {
        throw new Error('Method not implemented.');
    }
    async getTopWorkers(cellphone: string): Promise<Worker[]> {
        this.logger.log(`inicia`)

        return this.ratingsRepository.find({
            relations: {
                worker: true,
            },
        })
            .then(response => {
                this.logger.log(`initt`)
                this.logger.log(` ${JSON.stringify(response)}`)
                // if (response.length > 0) {
                //     this.logger.log(`[CEL: ${cellphone}] finaliza consulta de los servicios asociados al profesional con resultado: ${JSON.stringify(response)}`)
                //     return response;
                // } else {
                //     const msg = `[CEL: ${cellphone}] el profesional no tiene servicios asignados`
                //     this.logger.error(msg);
                //     throw new WorkerException(msg, HttpStatus.NOT_ACELEPTABLE);
                // }
                return [];
            })
            .catch(err => {
                this.logger.error(err);
                throw err;
            });
    }

    async getWorkerServices(cellphone: string) {
        this.logger.log(`[CEL: ${cellphone}] inicia consulta de las servicios asociados al profesional`)
        return this.workerServicesRepository.createQueryBuilder("worker_services")
            .leftJoinAndSelect("worker_services.worker", "worker")
            .leftJoinAndSelect("worker_services.service", "service")
            .leftJoinAndSelect("worker.userId", "user")
            .where("user.cellphone = :cellphone", { cellphone: cellphone })
            .select("service")
            .getRawMany()
            .then(response => {
                if (response.length > 0) {
                    this.logger.log(`[CEL: ${cellphone}] finaliza consulta de los servicios asociados al profesional con resultado: ${JSON.stringify(response)}`)
                    return response;
                } else {
                    const msg = `[CEL: ${cellphone}] el profesional no tiene servicios asignados`
                    this.logger.error(msg);
                    throw new WorkerException(msg, HttpStatus.NOT_ACCEPTABLE);
                }
            })
            .catch(err => {
                this.logger.error(err);
                throw err;
            });
    }

    async saveWorkerServices(cellphone: string, services: Service[]) {
        this.logger.log(`[CEL: ${cellphone}] inicia guardado del servicio del profesional`)
        const worker = await this.getWorkerInfo(cellphone);
        for (const service of services) {
            const workerServices = new WorkerServices();
            workerServices.worker = worker;
            workerServices.service = service;
            await this.workerServicesRepository.save(workerServices)
                .then(() => {
                    this.logger.log(`[CEL: ${cellphone}] finaliza guardado del servicio del profesional - Services: ${JSON.stringify(service)}`);
                })
                .catch(err => {
                    const msg = `[CEL: ${cellphone} Ocurrió un error al guardar del servicio del profesional - Services: ${JSON.stringify(service)}]`
                    this.logger.error(msg, err);
                    throw new WorkerException(msg, HttpStatus.INTERNAL_SERVER_ERROR)
                });
        }
    }

    async getWorkerInfo(cellphone: string) {
        this.logger.log(`[CEL: ${cellphone}] inicia obtención de la información del profesional`)
        return this.workerRepository.findOne({
            relations: {
                user: true,
            },
            where: {
                user: {
                    cellphone: cellphone,
                },
            },
        }).then(response => {
            this.logger.log(`[CEL: ${cellphone}] finaliza obtención de la información del profesional con resultado: ${JSON.stringify(response)}`)
            return response;
        }).catch(err => {
            const msg = `[CEL: ${cellphone}] ocurrió un error al obtener la información del profesional ${JSON.stringify(err)}`
            this.logger.error(msg, err)
            throw new WorkerException(msg, HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    async saveWorkerInfo(cellphone: string, worker: Worker) {
        this.logger.log(`[CEL: ${cellphone}] inicia guardado de la información del profesional`)
        const workerInfo = await this.mapWorkerInfo(cellphone, worker);
        await this.saveWorkerInBd(workerInfo);
    }

    async updateWorkerState(cellphone: string, status: EWorkerStatus) {
        this.logger.log(`[CEL: ${cellphone}] inicia actualización del estado del profesional`)
        const workerInfo = await this.getWorkerInfo(cellphone);
        workerInfo.workerStatus = await this.getWorkerStatus(status);
        await this.saveWorkerInBd(workerInfo);
        this.logger.log(`[CEL: ${cellphone}] finaliza actualización del estado del profesional`)
    }

    private async saveWorkerInBd(worker: Worker) {
        this.workerRepository.save(worker)
            .then(() => {
                this.logger.log(`[CEL: ${worker.user.cellphone}] finaliza guardado de la información del profesional`)
            })
            .catch(err => {
                const msg = `[CEL: ${worker.user.cellphone}] ocurrió un error al guardar la información del profesional ${JSON.stringify(err)}`
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

    private async mapWorkerInfo(cellphone: string, worker: Worker) {
        const workerInfo = await this.getWorkerInfo(cellphone);
        workerInfo.fee = worker.fee;
        workerInfo.startHour = worker.startHour;
        workerInfo.finalHour = worker.finalHour;
        workerInfo.ownVehicle = worker.ownVehicle;
        workerInfo.experience = worker.experience;
        return workerInfo;
    }
}
