import { BasaltKeyGenerator } from '../../Sources/BasaltKeyGenerator';
import { IBasaltKeyPairED25519 } from '@/Interfaces';

describe('BasaltKeyGenerator', (): void => {
    describe("generateKeyPairED25519", (): void => {
        it("should generate a key pair", (): void => {
            const keyPair: IBasaltKeyPairED25519 = new BasaltKeyGenerator().generateKeyPairED25519();
            expect(keyPair).toHaveProperty("privateKey");
            expect(keyPair).toHaveProperty("publicKey");
            expect(keyPair).toHaveProperty("passphrase");
        });
    });
});
