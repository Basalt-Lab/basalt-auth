import { generateKeyPairSync, KeyPairSyncResult, randomUUID } from 'crypto';

import { IBasaltKeyPairED25519 } from '@/Interfaces';

export class BasaltKeyGenerator {
    public generateKeyPairED25519(): IBasaltKeyPairED25519 {
        const passphrase: string = randomUUID();
        const keyPair: KeyPairSyncResult<string, string> = generateKeyPairSync('ed25519', {
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                passphrase,
                cipher: 'aes-256-cbc'
            }
        });
        return {
            ...keyPair,
            passphrase
        };
    }
}
