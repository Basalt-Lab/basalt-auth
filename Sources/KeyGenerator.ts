import { IKeyPairED25519 } from '@/Interfaces';
import { Crypto, KeyPairSyncResult } from '@basalt-lab/basalt-core';

export class KeyGenerator {
    public generateKeyPairED25519(): IKeyPairED25519 {
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
