import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from '../interfaces/user.interface';
import { Category } from 'src/database/entities/Category';
import { Client } from 'src/database/entities/Client';
import { Worker } from 'src/database/entities/Worker';
import { User } from 'src/database/entities/User';
import { TaskyException } from 'src/exceptions/tasky_exception';

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
        return this.userRepository.save(user)
            .then((userInfo: User) => {
                const worker = new Worker();
                worker.user = userInfo;
                worker.category = category;
                return this.workerRepository.save(worker).then(() => {
                    this.logger.log('finaliza almacenamiento del profesional en base de datos');
                }).catch(err => {
                    this.logger.error(err.message);
                    throw new TaskyException(500, "Ocurrió un error al guardar información de profesional");
                });
            })
            .catch(err => {
                this.logger.error(err.message);
                throw new TaskyException(500, "Ocurrió un error al guardar información en tabla de usuarios");
            });
    }

    async saveClient(user: User): Promise<void> {
        this.logger.log(`inicia almacenamiento del cliente en base de datos con info ${JSON.stringify(user)}`);
        return this.userRepository.save(user)
            .then((userInfo: User) => {
                const client = new Client();
                client.user = userInfo;
                return this.clientRepository.save(client).then(() => {
                    this.logger.log('finaliza almacenamiento del cliente en base de datos');
                }).catch(err => {
                    this.logger.error(err.message);
                    throw new TaskyException(500, "Ocurrió un error al guardar información de cliente");
                });
            })
            .catch(err => {
                this.logger.error(err.message);
                throw new TaskyException(500, "Ocurrió un error al guardar información en tabla de usuarios");
            });
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
                throw new TaskyException(HttpStatus.NOT_FOUND, "El usuario no existe en base de datos");
            }
        }).catch(err => {
            this.logger.error(err.message);
            throw new TaskyException(500, "Ocurrió un error al obtener info del usuario");
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
                throw new TaskyException(HttpStatus.NOT_FOUND, "El usuario no existe en base de datos");
            }
        }).catch(err => {
            this.logger.error(err.message);
            throw new TaskyException(500, "Ocurrió un error al obtener info del usuario por número de celular");
        });
    }

    async checkUserExists(cellphone: string): Promise<boolean> {
        this.logger.log(`[CEL:${cellphone}] inicia consulta del usuario en base de datos`);

        return this.userRepository.exist({
            where: {
                cellphone: cellphone,
            },
        }).then((userExists) => {
            this.logger.log(`[CEL:${cellphone}] finaliza consulta del usuario en base de datos con resultado: ${userExists}`);
            return userExists;
        }).catch(err => {
            this.logger.error(err.message);
            throw new TaskyException(500, "Ocurrió un error al consultar la existencia del usuario");
        });
        
    }

    async updateUser(user: User): Promise<void> {
        this.logger.log(`[CEL:${user.cellphone}] inicia actualización del usuario en base de datos con info -> ${JSON.stringify(user)}`);
        await this.userRepository.update({cellphone: user.cellphone}, user).then(() => {
            this.logger.log(`[CEL:${user.cellphone}] finaliza actualización del usuario en base de datos`);
        }).catch(err => {
            this.logger.log(`[CEL:${user.cellphone}] ocurrió un error al actualizar usuario err -> ${err}`);
            throw new TaskyException(500, "Error al actualizar cliente");
        })

    }
}
