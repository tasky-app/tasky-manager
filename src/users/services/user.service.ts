import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import {User} from '../../database/entities/User';
import {InjectRepository} from '@nestjs/typeorm';
import {Client} from '../../database/entities/Client';
import {Worker} from '../../database/entities/Worker';
import {EUserType} from '../enums/user_type';
import {UserException} from '../../exceptions/user_exception';

@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
        @InjectRepository(Worker) private readonly workerRepository: Repository<Worker>
    ) {
    }

    async saveUser(user:  User, userType: EUserType): Promise<void> {
        try {
            this.logger.log(`inicia almacenamiento del usuario en base de datos con info ${JSON.stringify(user)}`);
            const userInfo = await this.userRepository.save(user);
            this.logger.log('finaliza almacenamiento del usuario en base de datos');
            await this.saveUserType(userInfo, userType);
        } catch (err) {
            this.logger.error(err.message)
            throw err;
        }
    }

    async getUserInfo(documentNumber: string): Promise<User> {
        this.logger.log(`[CC:${documentNumber}] inicia obtención de la info del usuario`);
        return this.userRepository.findOne({
                where: {
                    documentNumber: documentNumber,
                },
            }
        ).then(userInfo => {
            if (userInfo != null) {
                this.logger.log(`[CC:${documentNumber}] finaliza obtención de la info del usuario con resultado: ${JSON.stringify(userInfo)}`);
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

    private async saveUserType(userInfo: User, userType: EUserType) {
        try {
            this.logger.log(`inicia almacenamiento del ${userType} en base de datos`);
            if (userType === EUserType.CLIENT) {
                const client = new Client();
                client.userId = userInfo;
                await this.clientRepository.save(client);
            } else {
                const worker = new Worker();
                worker.user = userInfo;
                await this.workerRepository.save(worker);
            }
            this.logger.log(`finaliza almacenamiento del ${userType} en base de datos`);
        } catch (err) {
            this.logger.error(`Ocurrió un error al almacenar el ${userType} en base de datos`)
            throw err;
        }
    }

}
