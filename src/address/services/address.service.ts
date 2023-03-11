import {HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Address} from '../../database/entities/Address';
import {AddressException} from '../../exceptions/address_exception';
import {UserService} from '../../users/services/user.service';

@Injectable()
export class AddressService {

    @Inject(UserService)
    private readonly userService: UserService;

    private readonly logger = new Logger(AddressService.name);

    constructor(
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>
    ) {
    }

    async getAddress(cellphone: string) {
        this.logger.log(`[CEL: ${cellphone}] inicia consulta de las direcciones del cliente`);
        return this.addressRepository.find({
            select: {
                address: true,
            },
            relations: {
                userId: true,
            },
            where: {
                userId: {
                    cellphone: cellphone,
                },
            },
        }).then(addresses => {
            if (addresses.length !== 0) {
                this.logger.log(`[CEL: ${cellphone}] finaliza consulta de las direcciones del cliente con resultado: ${JSON.stringify(addresses)}`);
                return addresses;
            } else {
                throw new AddressException(`No hay direcciones registradas para el cliente`, HttpStatus.NOT_FOUND);
            }
        })

    }

    async saveAddress(documentNumber: string, address: Address) {
        this.logger.log(`[CC: ${documentNumber}] inicia proceso de guardado de la dirección en base de datos: ${address}`);
        const user = await this.userService.getUserInfo(documentNumber);
        const addressEntity = new Address();
        addressEntity.address = address.address;
        addressEntity.city = address.city;
        addressEntity.neighborhood = address.neighborhood;
        addressEntity.userId = user;

        return this.addressRepository.save(addressEntity).then(addressResponse => {
            this.logger.log(`[CC: ${documentNumber}] finaliza proceso de guardado de la dirección en base de datos`);
            return addressResponse;
        }).catch(err => {
            this.logger.error(`[CC: ${documentNumber}] Ocurrió un error al guardar la dirección error: ${JSON.stringify(err)}`);
            throw new AddressException("Ocurrió un error al guardar la dirección", HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    async deleteAddress(cellphone: string, address: Address) {
        this.logger.log(`[CEL: ${cellphone}] inicia proceso de eliminación de la dirección ${address.address}`);
        await this.addressRepository.createQueryBuilder('delete_address')
            .delete()
            .from(Address)
            .where("address_id = :id", {id: address.addressId})
            .execute().then(() => {
                this.logger.log(`[CEL: ${cellphone}] finaliza proceso de eliminación de la dirección ${address.address}`);
            }).catch(err => {
                this.logger.log(`[CEL: ${cellphone}] ocurrió un error al eliminar la dirección ${JSON.stringify(err)}`);
                throw new AddressException("Ocurrió un error al eliminar la dirección", HttpStatus.INTERNAL_SERVER_ERROR)
            })
    }
}
