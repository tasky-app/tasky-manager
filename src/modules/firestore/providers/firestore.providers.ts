import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export const FirestoreProviders = [
    {
        provide: 'APP',
        useFactory: () => {
            let app;
            if (!admin.apps.length) {
                app = admin.initializeApp({
                    credential: admin.credential.applicationDefault(),
                });
            } else {
                app = admin.app();
            }
            return app;
        },
    },
    {
        provide: 'COLOMBIA',
        inject: ['APP'],
        useFactory: (app) => {
            return getFirestore(app, '(default)');
        },
    },
    {
        provide: 'CHILE',
        inject: ['APP'],
        useFactory: (app) => {
            return getFirestore(app, 'tasky-cl');
        },
    },
];
