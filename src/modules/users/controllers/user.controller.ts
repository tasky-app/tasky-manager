import {Body, Controller, Get, Headers, Logger, Post, Put} from "@nestjs/common";
import {UserService} from '../services/user.service';
import {User} from '../../database/entities/User';

@Controller("user")
export class UserController {

    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {
    }

    //OK - 27/08/2023
    @Post("client")
    public async createClientInDb(@Body() user: User): Promise<void> {
        this.logger.log(`[CC: ${user.documentNumber}] INICIA CREACIÓN DE CLIENTE EN BASE DE DATOS`);
        await this.userService.saveClient(user);
        this.logger.log(`[CC: ${user.documentNumber}] FINALIZA CREACIÓN DE CLIENTE EN BASE DE DATOS`);
    }

    //OK - 27/08/2023
    @Post("worker")
    public async createWorkerInDb(@Body() body): Promise<void> {
        const user = body.user; 
        const category = body.category;

        this.logger.log(`[CC: ${user.documentNumber}] INICIA CREACIÓN DE PROFESIONAL EN BASE DE DATOS`);
        await this.userService.saveWorker(user, category);
        this.logger.log(`[CC: ${user.documentNumber}] FINALIZA CREACIÓN DE PROFESIONAL EN BASE DE DATOS`);
    }

    //OK - 27/08/2023
    @Get()
    public async userInfo(@Headers() headers) {
        this.logger.log(`[CC: ${headers.document_number}] INICIA OBTENCIÓN DE LA INFORMACIÓN DEL USUARIO`);
        const user = await this.userService.getUserInfo(headers.cellphone);
        this.logger.log(`[CC: ${headers.document_number}] FINALIZA OBTENCIÓN DE LA INFORMACIÓN DEL USUARIO`);
        return user;
    }

    //OK - 27/08/2023
    @Get("exists")
    public async userExistsInDb(@Headers() headers): Promise<boolean> {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA CONSULTA DE REGISTRO DEL USUARIO`);
        const userExists = await this.userService.checkUserExists(headers.cellphone);
        this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA CONSULTA DE REGISTRO DEL USUARIO CON RESULTADO`);
        return userExists;
    }

    //TODO PENDING
    @Put()
    public async editUserInfo(@Headers() headers) {
        this.logger.log(`[CC: ${headers.documentNumber}] INICIA ACTUALIZACIÓN DE LA INFORMACIÓN DEL USUARIO EN BASE DE DATOS`);
        this.logger.log(`[CC: ${headers.documentNumber}] FINALIZA ACTUALIZACIÓN DE LA INFORMACIÓN DEL USUARIO EN BASE DE DATOS`);
    }
}
