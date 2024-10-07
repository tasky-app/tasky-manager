import { Body, Controller, Delete, Get, Headers, Logger, Post, Put } from "@nestjs/common";
import { AddressService } from '../services/address.service';
import { Address } from "legacy/database/entities/Address";
import { TaskyException } from "src/exceptions/tasky_exception";

@Controller("address")
export class AddressController {

    private readonly logger = new Logger(AddressController.name);

    constructor(private readonly addressService: AddressService) {
    }

    //HAY UN BUG, PERMITE OBTENER TODAS LAS DIRECCIONES ASÍ VENGA CON HEADER VACIO
    //OK - 27/08/2023
    @Get()
    public async getAddresses(@Headers() headers) {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA OBTENCIÓN DE LAS DIRECCIONES DEL CLIENTE`);
        return this.addressService.getAddress(headers.cellphone).then((addresses) => {
            this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA OBTENCIÓN DE LAS DIRECCIONES DEL CLIENTE`);
            return addresses;
        }).catch((err) => {
            throw new TaskyException(err.message, err.status)
        });

    }

    //OK - 27/08/2023
    @Get('main')
    public async getMainAddress(@Headers() headers) {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA OBTENCIÓN DE LA DIRECCIÓN PRINCIPAL DEL CLIENTE`);
        return this.addressService.getMainAddress(headers.cellphone).then((mainAddress) => {
            this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA OBTENCIÓN DE LA DIRECCIÓN PRINCIPAL DEL CLIENTE`);
            return mainAddress;
        }).catch((err) => {
            throw new TaskyException(err.message, err.status)
        });
    }

    //TODO PENDING NO ESTÁ ACTUALIZANDO LA DIRECCIÓN PRINCIPAL
    @Put('main')
    public async updateMainAddress(@Headers() headers, @Body() body: Address) {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA ACTUALIZACIÓN DE LA DIRECCIÓN DEL CLIENTE`);
        return this.addressService.updateMainAddress(headers.cellphone, body).then((mainAdress) => {
            this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA ACTUALIZACIÓN DE LA DIRECCIÓN DEL CLIENTE`);
            return mainAdress;
        }).catch((err) => {
            throw new TaskyException(err.message, err.status)
        });
    }

    //TODO PENDING ESTÁ PERMITIENDO GUARDAR VARIAS DIRECCIONES PRINCIPALES
    @Post()
    public async saveAddressInDb(@Headers() headers, @Body() body: Address) {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA REGISTRO DE LA DIRECCIÓN DEL CLIENTE`);
        const address = await this.addressService.saveAddress(headers.cellphone, body);
        this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA REGISTRO DE LA DIRECCIÓN DEL CLIENTE`);
        return address;
    }

    //OK - 27/08/2023
    @Delete()
    public async deleteAddressFromDb(@Headers() headers, @Body() body) {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA ELIMINACIÓN DE LA DIRECCIÓN DEL CLIENTE`);
        return this.addressService.deleteAddress(headers.cellphone, body).then((mainAdress) => {
            this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA ELIMINACIÓN DE LA DIRECCIÓN DEL CLIENTE`);
            return mainAdress;
        }).catch((err) => {
            throw new TaskyException(err.message, err.status)
        });
    }

}
