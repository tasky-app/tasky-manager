import {Body, Controller, Delete, Get, Headers, Logger, Post} from "@nestjs/common";
import {AddressService} from '../services/address.service';

@Controller("address")
export class AddressController {

    private readonly logger = new Logger(AddressController.name);

    constructor(private readonly addressService: AddressService) {
    }

    @Get()
    public async getAddresses(@Headers() headers) {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA OBTENCIÓN DE LAS DIRECCIONES DEL CLIENTE`);
        const addresses = await this.addressService.getAddress(headers.cellphone);
        this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA OBTENCIÓN DE LAS DIRECCIONES DEL CLIENTE`);
        return addresses;
    }

    @Post()
    public async saveAddressInDb(@Headers() headers, @Body() body) {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA REGISTRO DE LA DIRECCIÓN DEL CLIENTE`);
        await this.addressService.saveAddress(headers.cellphone, body.address);
        this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA REGISTRO DE LA DIRECCIÓN DEL CLIENTE`);
    }

    @Delete()
    public async deleteAddressFromDb(@Headers() headers) {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA REGISTRO DE LA DIRECCIÓN DEL CLIENTE`);
        this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA REGISTRO DE LA DIRECCIÓN DEL CLIENTE`);
    }

}
