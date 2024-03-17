import { generateKeyPairSync, type KeyPairSyncResult, randomUUID } from 'crypto';

import { type IKeyPairED25519 } from '@/Interfaces';

/**
 * Generate a new ED25519 key pair with a passphrase and return it
 * @returns IBasaltKeyPairED25519
 */
function generateKeyPairED25519(): IKeyPairED25519 {
    const passphrase: string = randomUUID();
    const keyPair: KeyPairSyncResult<string, string> = generateKeyPairSync(
        'ed25519',
        {
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase
            }
        });
    return {
        ...keyPair,
        passphrase
    };
}

export { generateKeyPairED25519 };
