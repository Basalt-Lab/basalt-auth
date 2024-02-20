import { KeyGenerator } from '../../Sources/Common';
import { IKeyPairED25519 } from '../../Sources/Interfaces';

describe('BasaltKeyGenerator', (): void => {
    describe('generateKeyPairED25519', (): void => {
        it('should generate a key pair', (): void => {
            const keyPair: IKeyPairED25519 = new KeyGenerator().generateKeyPairED25519();
            expect(keyPair).toHaveProperty('privateKey');
            expect(keyPair).toHaveProperty('publicKey');
            expect(keyPair).toHaveProperty('passphrase');
        });
    });
});
