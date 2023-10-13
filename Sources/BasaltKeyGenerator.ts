import { IBasaltKeyPairED25519 } from '@/Interfaces';
import { Crypto, KeyPairSyncResult } from '@basalt-lab/basalt-core';

export class BasaltKeyGenerator {
    public generateKeyPairED25519(): IBasaltKeyPairED25519 {
        const passphrase: string = Crypto.randomUUID();
        const keyPair: KeyPairSyncResult<string, string> = Crypto.generateED25519KeyPairSync({
            passphrase,
            cipher: 'aes-256-cbc'
        });
        return {
            ...keyPair,
            passphrase
        };
    }
}
