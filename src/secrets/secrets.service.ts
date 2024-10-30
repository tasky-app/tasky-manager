import { Injectable } from '@nestjs/common';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { getFirestore } from 'firebase-admin/firestore';

import * as admin from 'firebase-admin';

@Injectable()
export class SecretsService {
    private client = new SecretManagerServiceClient();
    private db: FirebaseFirestore.Firestore; 

    async getSecret(): Promise<FirebaseFirestore.Firestore> {
        // Secret manager
        const [version] = await this.client.accessSecretVersion({
            name: `projects/tasky-operation-dev/secrets/${process.env.SECRET_NAME}/versions/latest`,
        });
        const payload = version.payload?.data?.toString();
        if (!payload) {
            throw new Error(`No se pudo encontrar el secreto SECRET_NAME`);
        }

        // Connection BD
        if (!admin.apps.length) {
            admin.initializeApp({ credential: admin.credential.cert(JSON.parse(payload)) });
        }

        // Init Firestore
        this.db = getFirestore();
        return this.db;
    }

    getDb(): FirebaseFirestore.Firestore {
        if (!this.db) {
            throw new Error('Firestore no ha sido inicializado. Llama a getSecret primero.');
        }
        return this.db;
    }
}
