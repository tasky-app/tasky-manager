import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import configuration from './configuration';

export class SecretManager {

    buildCredentials() {
        // return JSON.parse(configuration().google_app_credentials.replace(/\\n/g, '\n'));
        const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC0Gp3OQchNvcM9\nBoA3tIaNten/tdjotdokOlxBJhrts//dTXIKu4w4g9S1YKzJ4Vcv/vBCOga1U9RA\nkDKi1yS26kauJyOuCJJcDQ8xaGIhYBh7SYd8nlGMax4IdiA36lbP0dX6WKE3oBrT\nmnwJgp4vPpPfPiGbzOTIBKHbHMVcpNgEw1oL/TaE16P+gxJwR2bgiItEQ+P9i8et\nUdOvUIpkAY3+6WQEnkLke2d4V3o5kGebQDEpmIvWlHBbNO+/gVRg0UAsa3jMIUA1\npVaNwrCqWTiWUAMeWpTb0pCg8eBcyLucwXi+YxaFYLLbaOTfpny7spIF6fFdW+1s\nAypJlDGnAgMBAAECggEAUfOujNT4DQ/lEBauLyrQ8xiswnN/oNxmx4daxTZOmI0I\nRy3fT6zpcCnklyfHWBFWd/t8XdZDiSz87ufucpSNG0JdKQ+cN6uk1YgHusaxqFgu\nq6LYqMbteoSfZOBDZs4V9HiZ8lF0Aniy3Eh2Wml6CythY/rElj1UeQNKlwZvc+i0\n3+HdOMbonf0IrGkqIpRFT3pDT9YsOKO+vmGte/6bsT2DfqzuhyH7a87MAPNxd40x\nieyrUezHWfFVMjb+/ia/mAJ6mxNrMuyxGWW8mvIB8EOPVKXiQFPCfc4Gui9nGjrs\nF6+p8hJjM86xY6T4R6WinoUXQhOxuR5knYelUKScKQKBgQD5QYF4LNw6v35PEk2y\nWyOm2qjzA9xx0hBgcSw/aV3vCJuBY+KI1tQmFhIkLcUc6X7+/eUtzSWtgXeLYH3q\nup2MausqACgAe50S/tI8hfI3dTDw/BhU9S5NSqs4Z0T0dLgr9PwdFMLxTqPG/1M4\nYnHhj+3D6fN6LJ6AIsRom9r9CwKBgQC4+h+co+cjKpKKx0MQINQNUgfZeeY2rjU6\n1aTCsVb0VCJjV6AzSBaUOCDLLanoiYBn+nhr9XV+NHxWGhb+Pp+E1wljvPkiS1lv\nFSp+D3vSeeGJsW/XYc4gL0+izlvdGe6h2XF5E1dsWjOgedBucXZpvWHptzkx7osf\nqkzEk+SnVQKBgFFm1jyEEgxRm5OBO8SixRrp0EFFIoo9e0Gz1CqFY7r7yaVRFJtx\n5WjmzlfoZrZRfzsRefYiSErIvFzVT2oINgm0pUZbNLUrqZmZhNllOTxpVmltOxkL\n1WpCl3ZdK4TWVYttf6STsjKSZyRHIEuKwvxSP+k6j1x4E+9u60vqknMPAoGATTes\nxpjtPhLhhalU54CsxLq/qBto7N6gPeU9mECriectS8ciiwXG1yzvE6IGUZpEziMS\n7g5Tc9G5LcBKZOwDb1LNCqOyZIyL0wFE8cbI674RVoeJpqGfiHP3jIEUfCH9Kfc5\nlU9rqUGmV5FCXzhiNBXor8XazGtGDHvs/Aq44tkCgYBcxOl1VHtMkZYere/kfKpI\nNBvYGQOvwP/yvMwwfVu17w7Nc4KzCU+qKyDxGvMPDjJEv+U2rViKgiq0Xq8BfCuA\nsf0blQRwh4QsZx0He6d+F10C1zubvh1PSIOXTIVqqzsgCZNhKQJfAcgFb0hD+GN2\n5p3+mZodSaw0HdWSyipwFg==\n-----END PRIVATE KEY-----\n";
        // return {
        //     "type": "service_account",
        //     "project_id": "tasky-operation-dev",
        //     "private_key_id": "92b0ae4168d4b658a18be849657ea695fe0f85ce",
        //     "private_key": privateKey.replace(/\\n/g, '\n'),
        //     "client_email": "vercel@tasky-operation-dev.iam.gserviceaccount.com",
        //     "client_id": "102686993177303513205",
        //     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        //     "token_uri": "https://oauth2.googleapis.com/token",
        //     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        //     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/vercel%40tasky-operation-dev.iam.gserviceaccount.com",
        //     "universe_domain": "googleapis.com"
        // };
        return {
            type: "service_account",
            project_id: "tasky-operation-dev",
            private_key_id: "92b0ae4168d4b658a18be849657ea695fe0f85ce",
            private_key: privateKey,
            client_email: "vercel@tasky-operation-dev.iam.gserviceaccount.com",
            client_id: "102686993177303513205",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/vercel%40tasky-operation-dev.iam.gserviceaccount.com",
            universe_domain: "googleapis.com",
            google_cloud_project_id: "tasky-operation-dev",
        };

    }

    async getFirestoreSecret(secretName: string) {
        const client = new SecretManagerServiceClient({ credentials: this.buildCredentials() });
        const [version] = await client.accessSecretVersion({
            // name: `projects/${process.env.project_id}/secrets/${secretName}/versions/latest`,
            name: `projects/tasky-operation-dev/secrets/SECRET_ADMIN_PANEL/versions/latest`,
        });
        const payload = version.payload.data.toString();
        return payload;
    }
}