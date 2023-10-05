import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../../../database/entities/Address';
import { TaskyException } from '../../../exceptions/tasky_exception';
import { UserService } from '../../users/services/user.service';
import { IAddressService } from '../interfaces/address.interface';

@Injectable()
export class AddressService implements IAddressService {

    private readonly logger = new Logger(AddressService.name);

    constructor(
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
        private readonly userService: UserService
    ) {
    }

    async getAddressById(addressId: number): Promise<Address> {
        this.logger.log(`[ID: ${addressId}] inicia consulta de la dirección por id`);
        return this.addressRepository.findOneBy({ id: addressId }).then(address => {
            this.logger.log(`[ID: ${addressId}] finaliza consulta de la dirección por id con resultado: ${JSON.stringify(address)}`);
            return address;
        }).catch(err => {
            this.logger.error(`[ID: ${addressId}] ocurrió un error al consultar la dirección por id: ${JSON.stringify(err)}`);
            throw new TaskyException(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error al consultar la dirección")
        });
    }

    async getAddress(cellphone: string): Promise<Address[]> {
        this.logger.log(`[CEL: ${cellphone}] inicia consulta de las direcciones del cliente`);
        return this.addressRepository.find({
            select: {
                id: true,
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
                throw new TaskyException(HttpStatus.NOT_FOUND, "No hay direcciones registradas para el cliente");
            }
        })
    }

    async getMainAddress(cellphone: string): Promise<Address> {
        this.logger.log(`[CEL: ${cellphone}] inicia consulta de la dirección principal del cliente`);
        return this.addressRepository.find({
            select: {
                id: true,
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
                throw new TaskyException(HttpStatus.NOT_FOUND, "No hay direcciones principal para el cliente");
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
        addressEntity.mainAddress = address.mainAddress;
        addressEntity.userId = user;

        return this.addressRepository.save(addressEntity).then(addressResponse => {
            this.logger.log(`[CEL: ${cellphone}] finaliza proceso de guardado de la dirección en base de datos`);
            return addressResponse;
        }).catch(err => {
            this.logger.error(`[CEL: ${cellphone}] Ocurrió un error al guardar la dirección error: ${JSON.stringify(err)}`);
            throw new TaskyException(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error al guardar la dirección")
        });
    }

    async updateMainAddress(cellphone: string, address: Address) {
        this.logger.log(`[CEL: ${cellphone}] inicia proceso de actualización de la dirección en base de datos: ${JSON.stringify(address)}`);
        await this.disableCurrentMainAddress(cellphone);
        this.updateMainAddressQuery(cellphone, true, address.id);
    }

    async deleteAddress(cellphone: string, address: Address) {
        this.logger.log(`[CEL: ${cellphone}] inicia proceso de eliminación de la dirección ${address.address}`);
        await this.addressRepository.createQueryBuilder('delete_address')
            .delete()
            .from(Address)
            .where("address_id = :id", { id: address.id })
            .execute().then(() => {
                this.logger.log(`[CEL: ${cellphone}] finaliza proceso de eliminación de la dirección ${address.address}`);
            }).catch(err => {
                this.logger.log(`[CEL: ${cellphone}] ocurrió un error al eliminar la dirección ${JSON.stringify(err)}`);
                throw new TaskyException(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error al eliminar la dirección")
            })
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
                throw new TaskyException(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error al actualizar la dirección")
            });
    }

    private async disableCurrentMainAddress(cellphone: string) {
        const actualMainAddress = await this.getMainAddress(cellphone);
        this.updateMainAddressQuery(cellphone, false, actualMainAddress.id);
    }
}
