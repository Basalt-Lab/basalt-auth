import { generateKeyPairED25519 } from '../../Source/Common/Tools';
import { IKeyPairED25519 } from '../../Source/Interfaces';

describe('BasaltKeyGenerator', (): void => {
    describe('generateKeyPairED25519', (): void => {
        it('should generate a key pair', (): void => {
            const keyPair: IKeyPairED25519 = generateKeyPairED25519();
            expect(keyPair).toHaveProperty('privateKey');
            expect(keyPair).toHaveProperty('publicKey');
            expect(keyPair).toHaveProperty('passphrase');
        });
    });
});
