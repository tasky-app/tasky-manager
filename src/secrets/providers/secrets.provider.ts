import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export const SecretProvider = {
    provide: 'CREDENTIALS',
    useFactory: async () => {
        const client = new SecretManagerServiceClient();

        const [version] = await client.accessSecretVersion({
            name: `projects/${process.env.PROJECT_ID_NAME}/secrets/${process.env.SECRET_NAME}/versions/latest`,
        });

        const payload = version.payload?.data?.toString();
        if (!payload) {
            throw new Error('No se pudo encontrar el secreto SECRET_NAME');
        }
        return payload;
    },
};
