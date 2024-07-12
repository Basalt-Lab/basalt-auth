import { generateKeyPairSync, randomUUID, type KeyPairSyncResult } from 'crypto';

import type { IKeyPairED25519 } from '@/Common/Util/Interfaces/index.js';

/**
 * Generate a new ED25519 key pair with a passphrase and return it
 *
 * @returns The generated key pair with the passphrase. ({@link IKeyPairED25519})
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
