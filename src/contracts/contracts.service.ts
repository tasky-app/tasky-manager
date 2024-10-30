import { Injectable } from '@nestjs/common';
import { SecretsService } from '../secrets/secrets.service';

@Injectable()
export class ContractService {
    constructor(private readonly secretsService: SecretsService) { }

    async createContract() {
        const db = await this.secretsService.getSecret();
        const snapshot = await db.collection('contracts').get();
        return { contracts: snapshot.docs.map(doc => doc.data()) };
    }

    postTasks() {
        return { message: 'Tareas creadas exitosamente' };
    }

    async calculateTotalBalance(taskerId: string): Promise<number> {
        const db = await this.secretsService.getSecret();

        const snapshot = await db.collection('contracts')
            .where('stateService', '==', 'finished')
            .where('taskerId', '==', taskerId)
            .get();

        if (snapshot.empty) {
            console.log(`No se encontraron contratos finalizados para el tasker con ID ${taskerId}`);
            return 0;
        }

        let totalBalance = 0;

        snapshot.forEach(doc => {
            const contract = doc.data();
            if (contract.totalPayment) {
                if (contract.typeMembership === 'free') {
                    totalBalance += contract.totalPayment * 0.7;
                } else if (contract.typeMembership === 'premium') {
                    totalBalance += contract.totalPayment;
                }
            }
        });

        return Math.round(totalBalance);
    }


}
