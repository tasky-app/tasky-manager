import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IServicesService } from '../interfaces/services.interface';
import { TopService } from 'src/database/entities/TopServices';
import { Service } from 'src/database/entities/Service';

@Injectable()
export class ServicesService implements IServicesService{

    private readonly logger = new Logger(ServicesService.name);

    constructor(
        @InjectRepository(TopService) private readonly topServiceRepository: Repository<TopService>,
        @InjectRepository(Service) private readonly serviceRepository: Repository<Service>
    ) {
    }

    getServiceById(serviceId: number): Promise<Service> {
        this.logger.log(`[SERVICE ID: ${serviceId}] inicia obtención de la información del servicio`)
        return this.serviceRepository.findOneBy({id: serviceId})
            .then(response => {
                this.logger.log(`[SERVICE ID: ${serviceId}] finaliza obtención de la información del servicio con resultado -> ${JSON.stringify(response)}`)
                return response;
            })
            .catch(() => {
                this.logger.error("Ocurrió un error al obtener la información del servicio por id")
                throw new InternalServerErrorException("Error al obtener información de servicio")
            });
    }

    getAllServices(): Promise<Service[]> {
        return this.serviceRepository.find();
    }

    getTopServices(): Promise<TopService[]> {
        return this.topServiceRepository.find()
    }
}
