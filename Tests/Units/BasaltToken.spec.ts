import { BasaltToken } from '@/BasaltToken';
import { BasaltKeyGenerator } from '../../Sources/BasaltKeyGenerator';
import { IBasaltKeyPairED25519, IBasaltTokenSignResult, IBasaltTokenHeader } from '@/Interfaces';

describe('BasaltToken', (): void => {
    let basaltToken: BasaltToken;
    let keyGenerator: BasaltKeyGenerator;
    let keyPair: IBasaltKeyPairED25519;
    let token: string;

    beforeAll((): void => {
        basaltToken = new BasaltToken();
        keyGenerator = new BasaltKeyGenerator();
        keyPair = keyGenerator.generateKeyPairED25519();
    });

    describe('getTokenUuid', (): void => {
        it('should return the token uuid', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const result: IBasaltTokenSignResult = basaltToken.sign(60000, payload, 'Issuer', 'Audience', keyPair);
            const tokenUuid: string = basaltToken.getTokenUuid(result.token);
            expect(tokenUuid).toBe(result.uuid);
        });
    });

    describe('getExpirationDate', (): void => {
        it('should return the expiration date', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const date: Date = new Date(Date.now() + 60000);
            const result: IBasaltTokenSignResult = basaltToken.sign(60000, payload, 'Issuer', 'Audience', keyPair);
            const expirationDate: Date = basaltToken.getExpirationDate(result.token);
            expect(expirationDate).toEqual(date);
        });
    });

    describe('getAudience', (): void => {
        it('should return the audience', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const result: IBasaltTokenSignResult = basaltToken.sign(60000, payload, 'Issuer', 'Audience', keyPair);
            const audience: string = basaltToken.getAudience(result.token);
            expect(audience).toBe('Audience');
        });
    });

    describe('getIssuer', (): void => {
        it('should return the issuer', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const result: IBasaltTokenSignResult = basaltToken.sign(60000, payload, 'Issuer', 'Audience', keyPair);
            const issuer: string = basaltToken.getIssuer(result.token);
            expect(issuer).toBe('Issuer');
        });
    });

    describe('getHeader', (): void => {
        it('should return the header', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const result: IBasaltTokenSignResult = basaltToken.sign(60000, payload, 'Issuer', 'Audience', keyPair);
            const headerResult: IBasaltTokenHeader = basaltToken.getHeader(result.token);
            expect(headerResult.uuid).toEqual(result.uuid);
            expect(headerResult).toEqual(expect.objectContaining({
                issuer: 'Issuer',
                audience: 'Audience',
            }));
        });

        it('should throw an error if the token structure is invalid', (): void => {
            expect((): void => {
                basaltToken.getHeader('invalidToken');
            }).toThrowError('Invalid token structure');
        });
    });

    describe('getPayload', (): void => {
        it('should return the payload', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const result: IBasaltTokenSignResult = basaltToken.sign(60000, payload, 'Issuer', 'Audience', keyPair);
            const payloadResult: { someData: string } = basaltToken.getPayload(result.token);
            expect(payloadResult).toEqual(payload);
        });

        it('should throw an error if the token structure is invalid', (): void => {
            expect((): void => {
                basaltToken.getPayload('invalidToken');
            }).toThrowError('Invalid token structure');
        });
    });

    describe('isExpired', (): void => {
        it('should return true if the token is expired', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const result: IBasaltTokenSignResult = basaltToken.sign(0, payload, 'Issuer', 'Audience', keyPair);
            const expired: boolean = basaltToken.isExpired(result.token);
            expect(expired).toBe(true);
        });

        it('should return false if the token is not expired', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const result: IBasaltTokenSignResult = basaltToken.sign(60000, payload, 'Issuer', 'Audience', keyPair);
            const expired: boolean = basaltToken.isExpired(result.token);
            expect(expired).toBe(false);
        });
    });

    describe('sign', (): void => {
        it('should sign a token and return a token string', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const result: IBasaltTokenSignResult = basaltToken.sign(60000, payload, 'Issuer', 'Audience', keyPair);
            token = result.token;
            expect(typeof token).toBe('string');
        });

        it('should sign a token with default issuer and audience', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const result: IBasaltTokenSignResult = basaltToken.sign(60000, payload);
            expect(result.token).toBeDefined();
        });
    });

    describe('verify', (): void => {

        it('should throw an error if the token structure is invalid', (): void => {
            expect((): void => {
                basaltToken.verify('invalidToken', keyPair.publicKey);
            }).toThrowError('Invalid token structure');
        });

        it('should throw an error if the token is expired', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const result: IBasaltTokenSignResult = basaltToken.sign(0, payload, 'Issuer', 'Audience', keyPair);
            expect((): void => {
                basaltToken.verify(result.token, keyPair.publicKey);
            }).toThrowError('Token expired');
        });

        it('should throw an error if the token is invalid', (): void => {
            expect((): void => {
                basaltToken.verify('invalidToken', keyPair.publicKey);
            }).toThrowError('Invalid token');
        });

        it('should throw an error if the token signature is invalid', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const keyPair2: IBasaltKeyPairED25519 = keyGenerator.generateKeyPairED25519();
            const result: IBasaltTokenSignResult = basaltToken.sign(60000, payload, 'Issuer', 'Audience', keyPair);
            expect((): void => {
                basaltToken.verify(result.token, keyPair2.publicKey);
            }).toThrowError('Invalid token signature');
        });

    });
});
