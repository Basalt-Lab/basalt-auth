import { describe, expect, test } from 'bun:test';

import { basaltToken } from '#/core/basaltToken';
import type { BasaltTokenHeader } from '#/types/data/basaltTokenHeader.ts';
import type { BasaltTokenSignResult } from '#/types/data/basaltTokenSignResult.ts';


describe('BasaltTokenService', () => {
    describe('sign', () => {
        test('should return a token result', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            expect(tokenResult).toHaveProperty('token');
            expect(tokenResult).toHaveProperty('uuid');
            expect(tokenResult).toHaveProperty('publicKey');
        });

        test('should return a token result with custom expiration time', () => {
            const payload = { user: 'johnsmith' };
            const expirationMs = 1234;
            const tokenResult: BasaltTokenSignResult = basaltToken.sign(payload, expirationMs);
            expect(tokenResult).toHaveProperty('token');
            expect(tokenResult).toHaveProperty('uuid');
            expect(tokenResult).toHaveProperty('publicKey');
        });
    });

    describe('verify', () => {
        test('should throw an error if the token structure is invalid', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            expect(() => {
                basaltToken.verify('$$$$.$$$$', tokenResult.publicKey);
            }).toThrow('Token structure is invalid.');
        });

        test('should throw an error if the token has expired', async () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({}, 1);
            await Bun.sleep(2);
            expect(() => {
                basaltToken.verify(tokenResult.token, tokenResult.publicKey);
            }).toThrow('Token has expired.');
        });

        test('should throw an error if the token signature is invalid', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            const badPayload = { user: 'admin' };
            const mutedToken = basaltToken.sign(badPayload).token;
            expect(() => {
                basaltToken.verify(tokenResult.token, 'invalidPublicKey');
            }).toThrow('Token signature is invalid.');
            expect(() => {
                basaltToken.verify(mutedToken, tokenResult.publicKey);
            }).toThrow('Token signature is invalid.');
        });
    });

    describe('isExpired', () => {
        test('should return true if the token has expired', async () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({}, 1);
            await Bun.sleep(2);
            expect(basaltToken.isExpired(tokenResult.token)).toBe(true);
        });

        test('should return false if the token has not expired', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            expect(basaltToken.isExpired(tokenResult.token)).toBe(false);
        });

        test('should throw an error if the token structure is invalid', () => {
            expect(() => basaltToken.isExpired('$$$$.$$$$')).toThrow('Token structure is invalid.');
        });

        test('should throw an error if header is invalid', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            const badToken = tokenResult.token.replace('e', 'a');
            expect(() => basaltToken.isExpired(badToken)).toThrow('Token header is invalid.');
        });
    });

    describe('getPayload', () => {
        test('should return the token payload', () => {
            const payload = { user: 'johndoe' };
            const tokenResult: BasaltTokenSignResult = basaltToken.sign(payload);
            expect(basaltToken.getPayload(tokenResult.token)).toEqual(payload);
        });

        test('should throw an error if the token structure is invalid', () => {
            expect(() => basaltToken.getPayload('$$$$.$$$$')).toThrow('Token structure is invalid.');
        });

        test('should throw an error if payload is invalid', () => {
            const payload = { user: 'johnsmith' };
            const tokenResult: BasaltTokenSignResult = basaltToken.sign(payload);
            const splittedToken = tokenResult.token.split('.');
            splittedToken[1] = 'badPayload';
            const mutedToken = splittedToken.join('.');
            expect(() => basaltToken.getPayload(mutedToken)).toThrow('Token payload is invalid.');
        });
    });

    describe('getHeader', () => {
        test('should return the token header', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            const header: BasaltTokenHeader = basaltToken.getHeader(tokenResult.token);
            expect(header).toHaveProperty('exp');
            expect(header).toHaveProperty('uuid');
            expect(header).toHaveProperty('issuer');
            expect(header).toHaveProperty('audience');
        });

        test('should throw an error if the token structure is invalid', () => {
            expect(() => basaltToken.getHeader('$$$$.$$$$')).toThrow('Token structure is invalid.');
        });

        test('should throw an error if header is invalid', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            const badToken = tokenResult.token.replace('e', 'a');
            expect(() => basaltToken.getHeader(badToken)).toThrow('Token header is invalid.');
        });
    });

    describe('getIssuer', () => {
        test('should return the default token issuer', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            expect(basaltToken.getIssuer(tokenResult.token)).toBe('Basalt-Issuer');
        });

        test('should return the custom token issuer', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({}, 1000, 'Custom-Issuer');
            expect(basaltToken.getIssuer(tokenResult.token)).toBe('Custom-Issuer');
        });

        test('should throw an error if the token structure is invalid', () => {
            expect(() => basaltToken.getIssuer('$$$$.$$$$')).toThrow('Token structure is invalid.');
        });

        test('should throw an error if header is invalid', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            const badToken = tokenResult.token.replace('e', 'a');
            expect(() => basaltToken.getIssuer(badToken)).toThrow('Token header is invalid.');
        });
    });

    describe('getAudience', () => {
        test('should return the default token audience', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            expect(basaltToken.getAudience(tokenResult.token)).toBe('Basalt-Audience');
        });

        test('should return the custom token audience', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({}, 1000, 'Basalt-Issuer', 'Custom-Audience');
            expect(basaltToken.getAudience(tokenResult.token)).toBe('Custom-Audience');
        });

        test('should throw an error if the token structure is invalid', () => {
            expect(() => basaltToken.getAudience('$$$$.$$$$')).toThrow('Token structure is invalid.');
        });

        test('should throw an error if header is invalid', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            const badToken = tokenResult.token.replace('e', 'a');
            expect(() => basaltToken.getAudience(badToken)).toThrow('Token header is invalid.');
        });
    });

    describe('getExpirationDate', () => {
        test('should return the token expiration date', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({}, 1000);
            const expirationDate = basaltToken.getExpirationDate(tokenResult.token);
            expect(expirationDate).toBeInstanceOf(Date);
        });

        test('should throw an error if the token structure is invalid', () => {
            expect(() => basaltToken.getExpirationDate('$$$$.$$$$')).toThrow('Token structure is invalid.');
        });

        test('should throw an error if header is invalid', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            const badToken = tokenResult.token.replace('e', 'a');
            expect(() => basaltToken.getExpirationDate(badToken)).toThrow('Token header is invalid.');
        });
    });

    describe('getTokenUuid', () => {
        test('should return the token UUID', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            expect(basaltToken.getTokenUuid(tokenResult.token)).toBe(tokenResult.uuid);
        });

        test('should throw an error if the token structure is invalid', () => {
            expect(() => basaltToken.getTokenUuid('$$$$.$$$$')).toThrow('Token structure is invalid.');
        });

        test('should throw an error if header is invalid', () => {
            const tokenResult: BasaltTokenSignResult = basaltToken.sign({});
            const badToken = tokenResult.token.replace('e', 'a');
            expect(() => basaltToken.getTokenUuid(badToken)).toThrow('Token header is invalid.');
        });
    });
});
