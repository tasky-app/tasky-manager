import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { SecretManager } from 'config/secret_manager';
import configuration from 'config/configuration';

const secretManager = new SecretManager();
const secretReference = configuration().secret_name;

export const FirestoreProviders = [
    {
        provide: 'APP',
        useFactory: async () => {
            const serviceAccountKey = await secretManager.getFirestoreSecret(secretReference);
            const credentials = JSON.parse(serviceAccountKey);
            let app;
            if (!admin.apps.length) {
                app = admin.initializeApp({
                    credential: admin.credential.cert(credentials)
                });
            } else {
                app = admin.app();
            }
            return app;
        }
    },
    {
        provide: 'COLOMBIA',
        inject: ['APP'],
        useFactory: (app) => {
            return getFirestore(app, '(default)');
        }
    },
    {
        provide: 'CHILE',
        inject: ['APP'],
        useFactory: (app) => {
            return getFirestore(app, 'tasky-cl')
        }
    }
];