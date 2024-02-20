import { generateKeyPairSync, KeyPairSyncResult, randomUUID } from 'crypto';

import { IKeyPairED25519 } from '@/Interfaces';

/**
 * Class to manage the generation of cryptographic keys.
 * @internal
 */
export class KeyGenerator {
    /**
    * Generate a new ED25519 key pair with a passphrase and return it
    * @returns IBasaltKeyPairED25519
    */
    public generateKeyPairED25519(): IKeyPairED25519 {
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
}
