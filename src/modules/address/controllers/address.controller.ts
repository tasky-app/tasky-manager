import {Body, Controller, Delete, Get, Headers, Logger, Post, Put} from "@nestjs/common";
import {AddressService} from '../services/address.service';
import { Address } from "src/database/entities/Address";

@Controller("address")
export class AddressController {

    private readonly logger = new Logger(AddressController.name);

    constructor(private readonly addressService: AddressService) {
    }

    //OK - 27/08/2023
    @Get()
    public async getAddresses(@Headers() headers) {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA OBTENCIÓN DE LAS DIRECCIONES DEL CLIENTE`);
        const addresses = await this.addressService.getAddress(headers.cellphone);
        this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA OBTENCIÓN DE LAS DIRECCIONES DEL CLIENTE`);
        return addresses;
    }

    //OK - 27/08/2023
    @Get('main')
    public async getMainAddress(@Headers() headers) {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA OBTENCIÓN DE LAS DIRECCIONES DEL CLIENTE`);
        const addresses = await this.addressService.getMainAddress(headers.cellphone);
        this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA OBTENCIÓN DE LAS DIRECCIONES DEL CLIENTE`);
        return addresses;
    }

    //TODO PENDING
    @Put('main')
    public async updateMainAddress(@Headers() headers, @Body() body: Address) {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA ACTUALIZACIÓN DE LA DIRECCIÓN DEL CLIENTE`);
        const addresses = await this.addressService.updateMainAddress(headers.cellphone, body);
        this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA ACTUALIZACIÓN DE LA DIRECCIÓN DEL CLIENTE`);
        return addresses;
    }

    //OK - 27/08/2023
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
        await this.addressService.deleteAddress(headers.cellphone, body);
        this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA ELIMINACIÓN DE LA DIRECCIÓN DEL CLIENTE`);
    }

}
