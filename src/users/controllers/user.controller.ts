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
    public async createInBd(@Headers() headers, @Body() user: User): Promise<void> {
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
        this.logger.log(`[CC: ${headers.document_number}] [TYPE: ${headers.user_type}] INICIA CREACIÓN DE LA INFORMACIÓN DE CONTACTO EN BASE DE DATOS`);
        await this.userService.saveContactInfo(headers.document_number, contactInfo);
        this.logger.log(`[CC: ${headers.documentNumber}] [TYPE: ${headers.user_type}] FINALIZA CREACIÓN DE LA INFORMACIÓN DE CONTACTO EN BASE DE DATOS`);
    }

    @Put("type")
    public async createUserType(@Headers() headers) {
        this.logger.log(`[CC: ${headers.documentNumber}] [TYPE: ${headers.user_type}] INICIA CREACIÓN DEL TIPO DE USUARIO EN BASE DE DATOS`);
        this.logger.log(`[CC: ${headers.documentNumber}] [TYPE: ${headers.user_type}] FINALIZA CREACIÓN DEL TIPO DE USUARIO EN BASE DE DATOS`);
    }

    @Put()
    public async editUserInfo(@Headers() headers) {
        this.logger.log(`[CC: ${headers.documentNumber}] INICIA ACTUALIZACIÓN DE LA INFORMACIÓN DEL USUARIO EN BASE DE DATOS`);
        this.logger.log(`[CC: ${headers.documentNumber}] FINALIZA ACTUALIZACIÓN DE LA INFORMACIÓN DEL USUARIO EN BASE DE DATOS`);
    }
}
