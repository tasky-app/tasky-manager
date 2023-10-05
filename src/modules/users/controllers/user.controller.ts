import { Body, Controller, Get, Headers, Logger, Post, Put } from "@nestjs/common";
import { UserService } from '../services/user.service';
import { User } from "src/database/entities/User";
import { TaskyException } from "src/exceptions/tasky_exception";

@Controller("user")
export class UserController {

    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {
    }

    //OK - 27/08/2023
    @Post("client")
    public async createClientInDb(@Body() user: User): Promise<void> {
        this.logger.log(`[CC:  -> ${JSON.stringify(user)}] INICIA CREACIÓN DE CLIENTE EN BASE DE DATOSxxx`);
        this.logger.log(`[CC: ${user.cellphone}] INICIA CREACIÓN DE CLIENTE EN BASE DE DATOS`);
        await this.userService.saveClient(user)
            .then(() => {
                this.logger.log(`[CC: ${user.cellphone}] FINALIZA CREACIÓN DE CLIENTE EN BASE DE DATOS`);
            })
            .catch(err => {
                throw new TaskyException(err.message, err.status);
            });
    }

    //OK - 27/08/2023
    @Post("worker")
    public async createWorkerInDb(@Body() body): Promise<void> {
        const user = body.user;
        const category = body.category;

        this.logger.log(`[CC: ${user.cellphone}] INICIA CREACIÓN DE PROFESIONAL EN BASE DE DATOS`);
        await this.userService.saveWorker(user, category)
            .then(() => {
                this.logger.log(`[CC: ${user.cellphone}] FINALIZA CREACIÓN DE PROFESIONAL EN BASE DE DATOS`);

            })
            .catch(err => {
                throw new TaskyException(err.message, err.status);
            });
    }

    //OK - 27/08/2023
    @Get()
    public async userInfo(@Headers() headers) {
        this.logger.log(`[CC: ${headers.document_number}] INICIA OBTENCIÓN DE LA INFORMACIÓN DEL USUARIO`);
        return this.userService.getUserInfo(headers.cellphone)
            .then((user) => {
                this.logger.log(`[CC: ${headers.document_number}] FINALIZA OBTENCIÓN DE LA INFORMACIÓN DEL USUARIO`);
                return user;
            })
            .catch(err => {
                throw new TaskyException(err.message, err.status);
            });
    }

    //OK - 27/08/2023
    @Get("exists")
    public async userExistsInDb(@Headers() headers): Promise<boolean> {
        this.logger.log(`[CEL: ${headers.cellphone}] INICIA CONSULTA DE EXISTENCIA DE USUARIO`);
        return this.userService.checkUserExists(headers.cellphone)
            .then((user) => {
                this.logger.log(`[CEL: ${headers.cellphone}] FINALIZA CONSULTA DE EXISTENCIA DE USUARIO CON RESULTADO`);
                return user;
            })
            .catch(err => {
                throw new TaskyException(err.message, err.status);
            });
    }

    //TODO PENDING
    @Put()
    public async editUserInfo(@Headers() headers) {
        this.logger.log(`[CC: ${headers.documentNumber}] INICIA ACTUALIZACIÓN DE LA INFORMACIÓN DEL USUARIO EN BASE DE DATOS`);
        this.logger.log(`[CC: ${headers.documentNumber}] FINALIZA ACTUALIZACIÓN DE LA INFORMACIÓN DEL USUARIO EN BASE DE DATOS`);
    }
}
