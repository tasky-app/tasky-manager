import {Body, Controller, Get, Headers, Logger, Post, Put} from "@nestjs/common";
import {UserService} from '../services/user.service';
import {User} from '../../database/entities/User';
import {ContactInfo} from '../../database/entities/ContactInfo';

@Controller("user")
export class UserController {

    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {
    }

    @Post()
    public async createInDb(@Headers() headers, @Body() user: User): Promise<void> {
        this.logger.log(`[CC: ${user.documentNumber}] INICIA CREACIÓN DEL USUARIO EN BASE DE DATOS`);
        await this.userService.saveUser(user, headers.user_type);
        this.logger.log(`[CC: ${user.documentNumber}] FINALIZA CREACIÓN DEL USUARIO EN BASE DE DATOS`);
    }

    @Get()
    public async userInfo(@Headers() headers) {
        this.logger.log(`[CC: ${headers.document_number}] INICIA OBTENCIÓN DE LA INFORMACIÓN DEL USUARIO`);
        const user = await this.userService.getUserInfo(headers.document_number);
        this.logger.log(`[CC: ${headers.document_number}] FINALIZA OBTENCIÓN DE LA INFORMACIÓN DEL USUARIO`);
        return user;
    }

    @Put("contact-info")
    public async createContactInfo(@Headers() headers, @Body() contactInfo: ContactInfo) {
        this.logger.log(`[CC: ${headers.document_number}] INICIA CREACIÓN DE LA INFORMACIÓN DE CONTACTO EN BASE DE DATOS`);
        await this.userService.saveContactInfo(headers.document_number, contactInfo);
        this.logger.log(`[CC: ${headers.document_number}] FINALIZA CREACIÓN DE LA INFORMACIÓN DE CONTACTO EN BASE DE DATOS`);
    }

    @Get("exists")
    public async userExistsInDb(@Headers() headers): Promise<boolean> {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA CONSULTA DE REGISTRO DEL USUARIO`);
        const userExists = await this.userService.checkUserExists(headers.cellphone);
        this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA CONSULTA DE REGISTRO DEL USUARIO CON RESULTADO`);
        return userExists;
    }

    @Put()
    public async editUserInfo(@Headers() headers) {
        this.logger.log(`[CC: ${headers.documentNumber}] INICIA ACTUALIZACIÓN DE LA INFORMACIÓN DEL USUARIO EN BASE DE DATOS`);
        this.logger.log(`[CC: ${headers.documentNumber}] FINALIZA ACTUALIZACIÓN DE LA INFORMACIÓN DEL USUARIO EN BASE DE DATOS`);
    }
}
