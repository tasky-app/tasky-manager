import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ContactInfo} from '../../database/entities/ContactInfo';
import {Address} from '../../database/entities/Address';
import {AddressException} from '../../exceptions/address_exception';

@Injectable()
export class AddressService {

    private readonly logger = new Logger(AddressService.name);

    constructor(
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
        @InjectRepository(ContactInfo) private readonly contactInfoRepository: Repository<ContactInfo>
    ) {
    }

    async getAddress(cellphone: string) {
        this.logger.log(`[CEL: ${cellphone}] inicia consulta de las direcciones del cliente`);
        return this.addressRepository.find({
            select: {
                address: true,
            },
            relations: {
                contactInfoId: true,
            },
            where: {
                contactInfoId: {
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

    async saveAddress(cellphone: string, address: string) {
        this.logger.log(`[CEL: ${cellphone}] inicia proceso de guardado de la dirección en base de datos: ${address}`);
        const contactInfo = await this.getContactInfo(cellphone);
        const addressEntity = new Address();
        addressEntity.address = address;
        addressEntity.contactInfoId = contactInfo;

        return this.addressRepository.save(addressEntity).then(addressResponse => {
            this.logger.log(`[CEL: ${cellphone}] finaliza proceso de guardado de la dirección en base de datos`);
            return addressResponse;
        }).catch(err => {
            this.logger.error(`[CEL: ${cellphone}] Ocurrió un error al guardar la dirección error: ${JSON.stringify(err)}`);
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

    private async getContactInfo(cellphone: string) {
        this.logger.log(`[CEL: ${cellphone}] inicia consulta de la información de contacto del cliente`);
        return this.contactInfoRepository.findOne({
            where: {
                cellphone: cellphone,
            },
        })
            .then(contactInfo => {
                if (contactInfo != null) {
                    this.logger.log(`[CEL: ${cellphone}] finaliza consulta de la información de contacto del cliente con resultado: ${JSON.stringify(contactInfo)}`);
                    return contactInfo;
                } else {
                    this.logger.error(`[CEL: ${cellphone}] no existe información de contacto para el cliente`);
                    throw new AddressException("Ocurrió un error al obtener la info de contacto", HttpStatus.NOT_FOUND);
                }
            })
    }
}