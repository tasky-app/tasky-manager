import { Injectable, Logger } from '@nestjs/common';
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
    getAllServices(): Promise<Service[]> {
        return this.serviceRepository.find();
    }

    getTopServices(): Promise<TopService[]> {
        return this.topServiceRepository.find()
    }
}
