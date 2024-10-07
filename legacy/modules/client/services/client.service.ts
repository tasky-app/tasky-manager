import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "legacy/database/entities/Client";
import { Repository } from "typeorm";
import { IClientService } from "../interfaces/client.interface";

@Injectable()
export class ClientService implements IClientService {

    private readonly logger = new Logger(ClientService.name);

    constructor(
        @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    ) {
    }

    async getClientInfo(cellphone: string): Promise<Client> {
        this.logger.log(`[CEL: ${cellphone}] inicia obtención de la información del cliente`)
        return this.clientRepository.findOne({
            relations: {
                user: true,
            },
            where: {
                user: {
                    cellphone: cellphone,
                },
            },
        })
        .then(response => {
            this.logger.log(`[CEL: ${cellphone}] finaliza obtención de la información del cliente con resultado: ${JSON.stringify(response)}`)
            return response;
        }).catch(err => {
            const msg = `[CEL: ${cellphone}] ocurrió un error al obtener la información del cliente ${JSON.stringify(err)}`
            this.logger.error(msg, err)
            throw new InternalServerErrorException("Ocurrió un error al obtener la información del cliente")
        });
    }
}