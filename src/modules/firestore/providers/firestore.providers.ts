import * as admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';
import { SecretManager } from 'config/secret_manager';
import configuration from 'config/configuration';

const secretManager = new SecretManager();
const secretReference = configuration().secret_reference;

export const FirestoreProviders = [
    {
        provide: 'credentials',
        useFactory: async () => {
            const serviceAccountKey = await secretManager.getFirestoreSecret(secretReference);
            return JSON.parse(serviceAccountKey);
        }
    },
    {
        provide: 'colombia',
        inject: ['credentials'],
        useFactory: (secretValue) => {
            const app = admin.initializeApp({
                credential: admin.credential.cert(secretValue),
            }, 'colombiaDb');
            return app.firestore();
        }
    },
    {
        provide: 'chile',
        inject: ['credentials'],
        useFactory: (secretValue) => {
            const app = admin.initializeApp({
                credential: admin.credential.cert(secretValue),
                databaseURL: 'https://tasky-cl.firebaseio.com'
            }, 'chileDb');
            return app.firestore();
        }
    }
];