import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IPasswordService } from "../interfaces/password.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Password } from "legacy/database/entities/Password";
import { Repository } from "typeorm";
import { UserService } from "legacy/modules/users/services/user.service";

@Injectable()
export class PasswordService implements IPasswordService {

  private readonly logger = new Logger(PasswordService.name);

  constructor(
    @InjectRepository(Password) private readonly passwordRepository: Repository<Password>,
    private readonly userService: UserService,
  ) {
  }

  public async savePassword(cellphone: string, password: string): Promise<void> {
    this.logger.log(`[CEL:${cellphone}] inicia guardado de contraseña`);

    await this.userService.getUserInfoByCellphone(cellphone).then(response => {
      this.logger.log(`[CEL:${cellphone}] inicia guardado de contraseña`);
      const passwordToSave = new Password();
      passwordToSave.password = password;
      passwordToSave.userId = response;
      this.passwordRepository.save(passwordToSave).then(() => {
        this.logger.log(`[CEL:${cellphone}] finaliza guardado de contraseña`);
      }).catch(err => {
        this.logger.error(`[CEL:${cellphone}] Ocurrió un error al guardar la contraseña - error: ${JSON.stringify(err)}`);
        throw new InternalServerErrorException("Ocurrió un error al guardar la contraseña");
      });
    }).catch(err => {
      throw err;
    });
  }

  public async validatePassword(cellphone: string, password: string): Promise<void> {
    this.logger.log(`[CEL:${cellphone}] inicia validación de contraseña`);
    return this.getPasswordByCellphone(cellphone).then(response => {
      if (response.password == password) {
        this.logger.log(`[CEL:${cellphone}] la contraseña fue validada correctamente`);
      } else {
        this.logger.log(`[CEL:${cellphone}] contraseña incorrecta`);
        throw new UnauthorizedException("La contraseña es incorrecta");
      }
    }).catch((err) => {
      throw err;
    });
  }

  private async getPasswordByCellphone(cellphone: string): Promise<Password> {
    this.logger.log(`[CEL:${cellphone}] inicia consulta de contraseña por celular`);
    return this.passwordRepository.findOne({
      select: {
        id: true,
        password: true,
      },
      relations: {
        userId: true,
      },
      where: {
        userId: {
          cellphone: cellphone,
        },
      },
    }).then(response => {
      if (response != null) {
        this.logger.log(`[CEL:${cellphone}] finaliza consulta de contraseña por celular con resultado: ${JSON.stringify(response)}`);
        return response;
      } else {
        throw new NotFoundException("No se encontró contraseña para este cliente");
      }
    }).catch((err) => {
      throw err;
    });
  }

}
