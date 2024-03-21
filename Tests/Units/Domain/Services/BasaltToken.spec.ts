import {
    BasaltToken,
    BasaltTokenExpiry,
    generateKeyPairED25519,
    ErrorBasaltToken,
    BasaltTokenErrorCodes,
    type IKeyPairED25519,
    type IBasaltTokenSignResult,
    type IBasaltTokenHeader
} from '@/App';

describe('BasaltToken', (): void => {
    let basaltToken: BasaltToken;
    let keyPair: IKeyPairED25519;
    let token: string;

    beforeAll((): void => {
        basaltToken = new BasaltToken();
        keyPair = generateKeyPairED25519();
    });

    describe('getTokenUuid', (): void => {
        it('should return the token uuid', (): void => {
            const result: IBasaltTokenSignResult = basaltToken.sign({});
            const tokenUuid: string = basaltToken.getTokenUuid(result.token);
            expect(tokenUuid).toBe(result.uuid);
        });
    });

    describe('getExpirationDate', (): void => {
        it('should return the expiration date', (): void => {
            const date: Date = new Date(Date.now() + BasaltTokenExpiry.ONE_DAY);
            const result: IBasaltTokenSignResult = basaltToken.sign({}, BasaltTokenExpiry.ONE_DAY);
            const expirationDate: Date = basaltToken.getExpirationDate(result.token);
            expect(expirationDate.getTime()).toBeCloseTo(date.getTime(), -3);
        });
    });

    describe('getAudience', (): void => {
        it('should return the audience', (): void => {
            const result: IBasaltTokenSignResult = basaltToken.sign({});
            const audience: string = basaltToken.getAudience(result.token);
            expect(audience).toBe('Basalt-Audience');
        });
    });

    describe('getIssuer', (): void => {
        it('should return the issuer', (): void => {
            const result: IBasaltTokenSignResult = basaltToken.sign({});
            const issuer: string = basaltToken.getIssuer(result.token);
            expect(issuer).toBe('Basalt-Issuer');
        });
    });

    describe('getHeader', (): void => {
        it('should return the header', (): void => {
            const result: IBasaltTokenSignResult = basaltToken.sign({});
            const headerResult: IBasaltTokenHeader = basaltToken.getHeader(result.token);
            expect(headerResult.uuid).toEqual(result.uuid);
            expect(headerResult).toEqual(expect.objectContaining({
                issuer: 'Basalt-Issuer',
                audience: 'Basalt-Audience',
            }));
        });

        it('should throw an error if the token structure is invalid', (): void => {
            expect((): void => {
                basaltToken.getHeader('invalidToken');
            }).toThrow(new ErrorBasaltToken(BasaltTokenErrorCodes.BASALT_TOKEN_INVALID_STRUCTURE));
        });
    });

    describe('getPayload', (): void => {
        it('should return the payload', (): void => {
            const payload: { someData: string } = { someData: 'data' };
            const result: IBasaltTokenSignResult = basaltToken.sign(payload);
            const payloadResult: { someData: string } = basaltToken.getPayload(result.token);
            expect(payloadResult).toEqual(payload);
        });

        it('should throw an error if the token structure is invalid', (): void => {
            expect((): void => {
                basaltToken.getPayload('invalidToken');
            }).toThrow(new ErrorBasaltToken(BasaltTokenErrorCodes.BASALT_TOKEN_INVALID_STRUCTURE));
        });
    });

    describe('isExpired', (): void => {
        it('should return true if the token is expired', async (): Promise<void> => {
            const result: IBasaltTokenSignResult = basaltToken.sign({}, 0);
            await new Promise(resolve => setTimeout(resolve, 10));
            const expired: boolean = basaltToken.isExpired(result.token);
            expect(expired).toBe(true);
        });

        it('should return false if the token is not expired', (): void => {
            const result: IBasaltTokenSignResult = basaltToken.sign({}, BasaltTokenExpiry.ONE_DAY);
            const expired: boolean = basaltToken.isExpired(result.token);
            expect(expired).toBe(false);
        });
    });

    describe('sign', (): void => {
        it('should sign a token and return a token string', (): void => {
            const result: IBasaltTokenSignResult = basaltToken.sign({});
            token = result.token;
            expect(typeof token).toBe('string');
        });
    });

    describe('verify', (): void => {
        it('should throw an error if the token structure is invalid', (): void => {
            expect((): void => {
                basaltToken.verify('invalidToken', keyPair.publicKey);
            }).toThrow(new ErrorBasaltToken(BasaltTokenErrorCodes.BASALT_TOKEN_INVALID_STRUCTURE));
        });

        it('should throw an error if the token signature is invalid', (): void => {
            const result: IBasaltTokenSignResult = basaltToken.sign({});
            expect((): void => {
                basaltToken.verify(result.token, keyPair.publicKey);
            }).toThrow(new ErrorBasaltToken(BasaltTokenErrorCodes.BASALT_TOKEN_SIGNATURE_INVALID));
        });


        it('should throw an error if the token is expired', async (): Promise<void> => {
            const result: IBasaltTokenSignResult = basaltToken.sign({}, 0);
            await new Promise(resolve => setTimeout(resolve, 20));
            expect((): void => {
                basaltToken.verify(result.token, result.publicKey);
            }).toThrow(new ErrorBasaltToken(BasaltTokenErrorCodes.BASALT_TOKEN_IS_EXPIRED));
        });
    });
});
