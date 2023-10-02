import { Body, Controller, Headers, Logger, Post } from "@nestjs/common";
import { PasswordService } from "../services/Password.service";

@Controller("password")
export class PasswordController {

    private readonly logger = new Logger(PasswordController.name);

    constructor(private readonly passwordService: PasswordService) {
    }

    //OK - 27/08/2023
    @Post("/verify")
    public async verifyPassword(@Headers() headers, @Body() body): Promise<void> {
        const cellphone = headers.cellphone;
        const password = body.password;
        this.logger.log(`[CEL:${cellphone}] INICIA VERIFICACIÓN DE CONTRASEÑA DE CLIENTE`);
        return this.passwordService.validatePassword(cellphone, password).then(() => {
            this.logger.log(`[CEL:${cellphone}] FINALIZA VERIFICACIÓN DE CONTRASEÑA DE CLIENTE -> ACCESO AUTORIZADO`);
        }).catch((err) => {
            this.logger.log(`[CEL:${cellphone}] FINALIZA VERIFICACIÓN DE CONTRASEÑA DE CLIENTE -> ACCESO RECHAZADO`);
            throw err;
        });
    }

    //OK - 27/08/2023
    @Post("/save")
    public async savePassword(@Headers() headers, @Body() body): Promise<void> {
        const cellphone = headers.cellphone;
        const password = body.password;
        this.logger.log(`[CEL:${cellphone}] INICIA GUARDADO DE CONTRASEÑA DE CLIENTE`);
        await this.passwordService.savePassword(cellphone, password).then(() => {
            this.logger.log(`[CEL:${cellphone}] FINALIZA GUARDADO DE CONTRASEÑA DE CLIENTE`);
        }).catch((err) => {
            throw err;
        });
    }

}
