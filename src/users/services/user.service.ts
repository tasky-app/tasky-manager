import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../../database/entities/Client';
import { Worker } from '../../database/entities/Worker';
import { UserException } from '../../exceptions/user_exception';
import { IUserService } from '../interfaces/user.interface';
import { Category } from 'src/database/entities/Category';

@Injectable()
export class UserService implements IUserService {

    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
        @InjectRepository(Worker) private readonly workerRepository: Repository<Worker>
    ) {
    }

    async saveWorker(user: User, category: Category): Promise<void> {
        this.logger.log(`inicia almacenamiento del profesional en base de datos con info usuario: ${JSON.stringify(user)} con categoria: ${JSON.stringify(category)}`);
        const userInfo = await this.userRepository.save(user);
        const worker = new Worker();
        worker.user = userInfo;
        worker.category = category;
        return this.workerRepository.save(worker).then(() => {
            this.logger.log('finaliza almacenamiento del profesional en base de datos');
        }).catch(err => {
            this.logger.error(err.message);
            throw err;
        });
    }

    async saveClient(user: User): Promise<void> {
        try {
            this.logger.log(`inicia almacenamiento del cliente en base de datos con info ${JSON.stringify(user)}`);
            const userInfo = await this.userRepository.save(user);
            const client = new Client();
            client.user = userInfo;
            return this.clientRepository.save(client).then(() => {
                this.logger.log('finaliza almacenamiento del cliente en base de datos');
            }).catch(err => {
                this.logger.error(err.message);
                throw err;
            });
        } catch (err) {
            this.logger.error(err.message)
            throw err;
        }
    }

    async getUserInfo(cellphone: string): Promise<User> {
        this.logger.log(`[CEL:${cellphone}] inicia obtención de la info del usuario`);
        return this.userRepository.findOne({
            where: {
                cellphone: cellphone,
            },
        }).then(userInfo => {
            if (userInfo != null) {
                this.logger.log(`[CEL:${cellphone}] finaliza obtención de la info del usuario con resultado: ${JSON.stringify(userInfo)}`);
                return userInfo;
            } else {
                throw new UserException("El usuario no existe en base de datos", HttpStatus.NOT_FOUND);
            }
        }).catch(err => {
            this.logger.error(err.message);
            throw new UserException(err.message, err.status);
        });
    }

    async getUserInfoByCellphone(cellphone: string): Promise<User> {
        this.logger.log(`[CEL:${cellphone}] inicia obtención de la info del usuario por número de celular`);
        return this.userRepository.findOne({
            where: {
                cellphone: cellphone,
            },
        }).then(userInfo => {
            if (userInfo != null) {
                this.logger.log(`[CEL:${cellphone}] finaliza obtención de la info del usuario por número de celular con resultado: ${JSON.stringify(userInfo)}`);
                return userInfo;
            } else {
                throw new UserException("El usuario no existe en base de datos", HttpStatus.NOT_FOUND);
            }
        }).catch(err => {
            this.logger.error(err.message);
            throw new UserException(err.message, err.status);
        });
    }

    async checkUserExists(cellphone: string): Promise<boolean> {
        this.logger.log(`[CEL:${cellphone}] inicia consulta del usuario en base de datos`);

        const userExists = await this.userRepository.exist({
            where: {
                cellphone: cellphone,
            },
        });
        this.logger.log(`[CEL:${cellphone}] finaliza consulta del usuario en base de datos con resultado: ${userExists}`);
        return userExists;
    }
}
