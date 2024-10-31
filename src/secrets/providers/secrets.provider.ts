import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import configuration from 'config/configuration';
import * as fs from 'fs';
import * as path from 'path';

export const SecretProvider =
{
    provide: 'CREDENTIALS',
    useFactory: async () => {
        console.log('init get secret');
        const jsonFilePath = path.join(__dirname, '../../../../config/credentials.json');
        const data = fs.readFileSync(jsonFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        const client = new SecretManagerServiceClient({ credentials: jsonData });
        const [version] = await client.accessSecretVersion({
            name: `projects/${configuration().gcp_project_id_name}/secrets/${configuration().secret_name}/versions/latest`,
        });
        const payload = version.payload?.data?.toString();
        if (!payload) {
            throw new Error(`No se pudo encontrar el secreto SECRET_NAME`);
        }
        return payload;
    }
};