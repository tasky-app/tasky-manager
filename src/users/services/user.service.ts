import {Injectable, Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import {User} from '../../database/entities/User';
import {InjectRepository} from '@nestjs/typeorm';
import {Client} from '../../database/entities/Client';
import {Worker} from '../../database/entities/Worker';
import {EUserType} from '../enums/user_type';
import {ContactInfo} from '../../database/entities/ContactInfo';

@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
        @InjectRepository(Worker) private readonly workerRepository: Repository<Worker>,
        @InjectRepository(ContactInfo) private readonly contactInfoRepository: Repository<ContactInfo>
    ) {
    }

    async saveUser(user: User, userType: EUserType): Promise<void> {
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
        try {
            this.logger.log(`[CC:${documentNumber}] inicia obtención de la info del usuario`);
            const userInfo = await this.userRepository.findOne({
                    where: {
                        documentNumber: documentNumber,
                    },
                }
            );
            this.logger.log(`[CC:${documentNumber}] finaliza obtención de la info del usuario con resultado: ${JSON.stringify(userInfo)}`);
            return userInfo;
        } catch (err) {
            this.logger.error(err.message)
            throw err;
        }
    }

    async saveContactInfo(documentNumber: number, contactInfo: ContactInfo): Promise<void> {
        this.logger.log(`[CC:${documentNumber}] inicia almacenamiento de la información de contacto en base de datos con info: ${JSON.stringify(contactInfo)}`);
        const response = await this.contactInfoRepository.save(contactInfo);
        this.logger.log(`[CC:${documentNumber}] finaliza almacenamiento de la información de contacto en base de datos`);
        await this.saveContactInfoInUser(documentNumber, response);
    }

    private async saveContactInfoInUser(documentNumber: number, contactInfo: ContactInfo) {
        this.logger.log(`[CC:${documentNumber}] inicia actualización de la información de contacto con info: ${JSON.stringify(contactInfo)}`);
        const userInfo = await this.getUserInfo(documentNumber.toString());
        userInfo.contactInfoId = contactInfo;
        await this.contactInfoRepository.createQueryBuilder()
            .update(User, { ...userInfo })
            .where("document_number = :documentNumber", {documentNumber})
            .execute();
        this.logger.log(`[CC:${documentNumber}] finaliza actualización de la información de contacto`);
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
                worker.userId = userInfo;
                await this.workerRepository.save(worker);
            }
            this.logger.log(`finaliza almacenamiento del ${userType} en base de datos`);
        } catch (err) {
            this.logger.error(`Ocurrió un error al almacenar el ${userType} en base de datos`)
            throw err;
        }
    }

}
