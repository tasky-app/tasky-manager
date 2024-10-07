import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import configuration from './configuration';

const client = new SecretManagerServiceClient();

export class SecretManager {
    async getFirestoreSecret(secretName: string) {
        const [version] = await client.accessSecretVersion({
            name: secretName,
        });
        const payload = version.payload.data.toString();

        console.log(`Secret data: ${payload}`);
        return payload;
    }
}
