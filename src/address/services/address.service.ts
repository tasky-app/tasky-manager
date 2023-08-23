import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../../database/entities/Address';
import { AddressException } from '../../exceptions/address_exception';
import { UserService } from '../../users/services/user.service';

@Injectable()
export class AddressService {

    @Inject(UserService)
    private readonly userService: UserService;

    private readonly logger = new Logger(AddressService.name);

    constructor(
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>
    ) {
    }

    async getAddress(cellphone: string): Promise<Address[]> {
        this.logger.log(`[CEL: ${cellphone}] inicia consulta de las direcciones del cliente`);
        return this.addressRepository.find({
            select: {
                addressId: true,
                city: true,
                mainAddress: true,
                neighborhood: true,
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

    async getMainAddress(cellphone: string): Promise<Address> {
        this.logger.log(`[CEL: ${cellphone}] inicia consulta de la dirección principal del cliente`);
        return this.addressRepository.find({
            select: {
                addressId: true,
                city: true,
                mainAddress: true,
                neighborhood: true,
                address: true,
            },
            relations: {
                userId: true,
            },
            where: {
                userId: {
                    cellphone: cellphone,
                },
                mainAddress: true,
            },
        }).then(addresses => {
            if (addresses.length !== 0) {
                this.logger.log(`[CEL: ${cellphone}] finaliza consulta de la dirección principal del cliente: ${JSON.stringify(addresses[0])}`);
                return addresses[0];
            } else {
                throw new AddressException(`No hay direcciones principal para el cliente`, HttpStatus.NOT_FOUND);
            }
        });
    }

    async saveAddress(cellphone: string, address: Address) {
        this.logger.log(`[CEL: ${cellphone}] inicia proceso de guardado de la dirección en base de datos: ${JSON.stringify(address)}`);
        const user = await this.userService.getUserInfoByCellphone(cellphone);
        const addressEntity = new Address();
        addressEntity.address = address.address;
        addressEntity.city = address.city;
        addressEntity.neighborhood = address.neighborhood;
        addressEntity.userId = user;

        return this.addressRepository.save(addressEntity).then(addressResponse => {
            this.logger.log(`[CEL: ${cellphone}] finaliza proceso de guardado de la dirección en base de datos`);
            return addressResponse;
        }).catch(err => {
            this.logger.error(`[CEL: ${cellphone}] Ocurrió un error al guardar la dirección error: ${JSON.stringify(err)}`);
            throw new AddressException("Ocurrió un error al guardar la dirección", HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    async updateMainAddress(cellphone: string, address: Address) {
        this.logger.log(`[CEL: ${cellphone}] inicia proceso de actualización de la dirección en base de datos: ${JSON.stringify(address)}`);
        await this.disableCurrentMainAddress(cellphone);
        this.updateMainAddressQuery(cellphone, true, address.addressId);
    }

    private updateMainAddressQuery(cellphone: string, isMainAddress: boolean, addressId: number) {
        this.addressRepository.createQueryBuilder('update_address')
            .update(Address)
            .where("address_id = :address", { address: addressId })
            .set({
                mainAddress: isMainAddress,
            }).execute().then(() => {
                this.logger.log(`[CEL: ${cellphone}] finaliza proceso de actualización de la dirección en base de datos a estado -> ${isMainAddress}`);
            }).catch(err => {
                this.logger.error(`[CEL: ${cellphone}] Ocurrió un error al actualizar la dirección - error: ${JSON.stringify(err)}`);
                throw new AddressException("Ocurrió un error al actualizar la dirección", HttpStatus.INTERNAL_SERVER_ERROR)
            });
    }

    private async disableCurrentMainAddress(cellphone: string) {
        const actualMainAddress = await this.getMainAddress(cellphone);
        this.updateMainAddressQuery(cellphone, false, actualMainAddress.addressId);
    }


    async deleteAddress(cellphone: string, address: Address) {
        this.logger.log(`[CEL: ${cellphone}] inicia proceso de eliminación de la dirección ${address.address}`);
        await this.addressRepository.createQueryBuilder('delete_address')
            .delete()
            .from(Address)
            .where("address_id = :id", { id: address.addressId })
            .execute().then(() => {
                this.logger.log(`[CEL: ${cellphone}] finaliza proceso de eliminación de la dirección ${address.address}`);
            }).catch(err => {
                this.logger.log(`[CEL: ${cellphone}] ocurrió un error al eliminar la dirección ${JSON.stringify(err)}`);
                throw new AddressException("Ocurrió un error al eliminar la dirección", HttpStatus.INTERNAL_SERVER_ERROR)
            })
    }
}
