import { generateKeyPairSync, randomUUID, type KeyPairSyncResult } from 'crypto';

import type { KeyPairED25519 } from '#/types/data/keyPairED25519';

/**
 * Generate a new ED25519 key pair with a passphrase and return it
 *
 * @returns The generated key pair with the passphrase. ({@link KeyPairED25519})
 */
export function generateKeyPairED25519(): KeyPairED25519 {
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
        }
    );
    return {
        ...keyPair,
        passphrase
    };
}
