import { randomUUID, sign as sig, verify as ver } from 'crypto';

import { BasaltError, ErrorKeys } from '#/common/error/index.ts';

import type { BasaltTokenHeader, BasaltTokenSignResult, KeyPairED25519 } from '#/common/types/index.ts';
import { base64Decode, base64Encode, generateKeyPairED25519 } from '#/common/util/index.ts';

/**
 * Enumeration of token expiry times in milliseconds.
 */
export enum BasaltTokenExpiry {
    HALF_HOUR = 1800000,
    ONE_HOUR = 3600000,
    TWO_HOURS = 7200000,
    FOUR_HOURS = 14400000,
    FIVE_HOURS = 18000000,
    SIX_HOURS = 21600000,
    TWELVE_HOURS = 43200000,
    ONE_DAY = 86400000,
    ONE_WEEK = 604800000,
}

/**
 * Validates the structure of the provided token.
 * A valid token must contain three parts separated by dots: header, payload, and signature.
 *
 * @param token - The authentication token to validate.
 *
 * @returns True if the token structure is valid, false otherwise.
 */
function _structureIsValid(token: string): boolean {
    const [header, payload, signature]: string[] = token.split('.');
    return !(!header || !payload || !signature);
}

/**
 * Constructs a token header with necessary claims.
 *
 * @param tokenUUid - The unique identifier for the token.
 * @param expirationMs - The token's expiry time in milliseconds from the current time.
 * @param issuer - The issuer claim identifies the principal that issued the token.
 * @param audience - The audience claim identifies the recipients that the token is intended for.
 *
 * @returns A Base64-encoded JSON string representing the token header.
 */
function _buildHeader(tokenUUid: string, expirationMs: number, issuer: string, audience: string): string {
    return base64Encode(JSON.stringify({
        uuid: tokenUUid,
        exp: new Date(Date.now() + expirationMs),
        issuer,
        audience
    }));
}

/**
 * Constructs a token payload.
 *
 * @typeParam T - The type of the payload.
 *
 * @param payload - The payload of the token, containing the claims about the entity (typically the user). ({@link T})
 *
 * @returns A Base64-encoded JSON string representing the token payload.
 */
function _buildPayload<T extends object>(payload: T): string {
    return base64Encode(JSON.stringify(payload));
}

/**
 * Constructs a token signature using the provided header, payload, and private key.
 *
 * @param header - The Base64-encoded token header.
 * @param payload - The Base64-encoded token payload.
 * @param privateKey - The private key used to sign the token.
 * @param passphrase - The passphrase of the private key, if applicable.
 *
 * @returns The token's digital signature.
 */
function _buildSignature(header: string, payload: string, privateKey: string, passphrase: string): string {
    return sig(null, Buffer.from(`${header}.${payload}`), {
        key: privateKey,
        passphrase
    }).toString('base64');
}

/**
 * Retrieves the unique identifier (UUID) from the token.
 *
 * @param token - The authentication token.
 *
 * @throws ({@link BasaltError}) If the token structure is invalid. ({@link ErrorKeys.TOKEN_INVALID_STRUCTURE})
 *
 * @returns The UUID of the token.
 */
function getTokenUuid(token: string): string {
    return getHeader(token).uuid;
}

/**
 * Get the token expiration date
 *
 * @param token - The authentication token.
 *
 * @throws ({@link BasaltError}) If the token structure is invalid. ({@link ErrorKeys.TOKEN_INVALID_STRUCTURE})
 *
 * @returns The expiration date of the token.
 */
function getExpirationDate(token: string): Date {
    return new Date(getHeader(token).exp);
}

/**
 * Get the token audience
 *
 * @param token - The authentication token.
 *
 * @throws ({@link BasaltError}) If the token structure is invalid. ({@link ErrorKeys.TOKEN_INVALID_STRUCTURE})
 *
 * @returns The intended audience of the token.
 */
function getAudience(token: string): string {
    return getHeader(token).audience;
}

/**
 * Get the token issuer
 *
 * @param token - The authentication token.
 *
 * @throws ({@link BasaltError} If the token structure is invalid. ({@link ErrorKeys.TOKEN_INVALID_STRUCTURE})
 *
 * @returns The issuer of the token.
 */
function getIssuer(token: string): string {
    return getHeader(token).issuer;
}

/**
 * Parses the token header and returns it.
 *
 * @param token - The authentication token.
 *
 * @throws ({@link BasaltError}) If the token structure is invalid. ({@link ErrorKeys.TOKEN_INVALID_STRUCTURE})
 * @throws ({@link BasaltError}) If the token header is invalid. ({@link ErrorKeys.TOKEN_INVALID_HEADER})
 *
 * @returns The parsed header of the token. ({@link BasaltTokenHeader})
 */
function getHeader(token: string): BasaltTokenHeader {
    if (!_structureIsValid(token))
        throw new BasaltError({
            messageKey: ErrorKeys.TOKEN_INVALID_STRUCTURE,
            code: 401
        });
    const [header]: string[] = token.split('.');
    try {
        return JSON.parse(
            base64Decode(header as string)
        ) as BasaltTokenHeader;
    } catch {
        throw new BasaltError({
            messageKey: ErrorKeys.TOKEN_INVALID_HEADER,
            code: 401
        });
    }
}

/**
 * Parses the token payload and returns it.
 *
 * @typeParam T - The expected type of the payload.
 *
 * @param token - The authentication token.
 *
 * @throws ({@link BasaltError}) If the token structure is invalid. ({@link ErrorKeys.TOKEN_INVALID_STRUCTURE})
 * @throws ({@link BasaltError}) If the token payload is invalid. ({@link ErrorKeys.TOKEN_INVALID_PAYLOAD})
 *
 * @returns The parsed payload of the token. ({@link T})
 */
function getPayload<T extends object>(token: string): T {
    if (!_structureIsValid(token))
        throw new BasaltError({
            messageKey: ErrorKeys.TOKEN_INVALID_STRUCTURE,
            code: 401
        });
    const [, payload]: string[] = token.split('.');
    try {
        return JSON.parse(
            base64Decode(payload as string)
        ) as T;
    } catch {
        throw new BasaltError({
            messageKey: ErrorKeys.TOKEN_INVALID_PAYLOAD,
            code: 401
        });
    }
}

/**
 * Determines whether the token has expired.
 *
 * @param token - The authentication token.
 *
 * @throws ({@link BasaltError}) If the token structure is invalid. ({@link ErrorKeys.TOKEN_INVALID_STRUCTURE})
 *
 * @returns True if the token has expired, false otherwise.
 */
function isExpired(token: string): boolean {
    return new Date(getHeader(token).exp) < new Date();
}

/**
 * Sign a token with the provided payload, issuer, audience, and key pair.
 *
 * @typeParam T - The type of the payload.
 *
 * @param payload - The payload of the token, which contains the claims for the token. ({@link T})
 * @param expirationMs - The amount of milliseconds after which the token should expire. (default is 1 hour) ({@link BasaltTokenExpiry})
 * @param issuer - The issuer of the token. (default is 'Basalt-Issuer')
 * @param audience - [audience='YourAppName-Audience'] - The intended audience of the token. (default is 'Basalt-Audience')
 *
 * @returns An object containing the signed token, its UUID, and the public key. (The private key is not returned for security reasons, save only the public key and the UUID of the token.) ({@link BasaltTokenSignResult})
 *
 * @example
 * Basic usage:
 * ```typescript
 * const tokenResult = basaltToken.sign(\{ user: 'johndoe' \});
 * console.log(tokenResult.token); // The signed token
 * ```
 * @example
 * Custom expiration time:
 * ```typescript
 * const tokenResult = basaltToken.sign(\{ user: 'johndoe' \}, 1234); // U can use BasaltTokenExpiry enum [30mn, 1h, 2h, 4h, 5h, 6h, 12h, 1d, 1w]
 * console.log(tokenResult.token); // The signed token
 * ```
 */
function sign<T extends object>(
    payload: T,
    expirationMs: number = BasaltTokenExpiry.ONE_HOUR,
    issuer: string = 'Basalt-Issuer',
    audience: string = 'Basalt-Audience'
): BasaltTokenSignResult {
    const tokenUUid: string = randomUUID();
    const keyPair: KeyPairED25519 = generateKeyPairED25519();

    const headerStringify: string = _buildHeader(tokenUUid, expirationMs, issuer, audience);
    const payloadStringify: string = _buildPayload(payload);
    const signature: string = _buildSignature(headerStringify, payloadStringify, keyPair.privateKey, keyPair.passphrase);

    return {
        token: `${headerStringify}.${payloadStringify}.${signature}`,
        uuid: tokenUUid,
        publicKey: keyPair.publicKey,
    };
}

/**
 * Verifies the signature and expiration date of the token.
 *
 * @param token - The authentication token to verify.
 * @param publicKey - The public key corresponding to the private key used to sign the token.
 *
 * @throws ({@link BasaltError}) If the token structure is invalid. ({@link ErrorKeys.TOKEN_INVALID_STRUCTURE})
 * @throws ({@link BasaltError}) If the token has expired. ({@link ErrorKeys.TOKEN_IS_EXPIRED})
 * @throws ({@link BasaltError}) If the token signature is invalid. ({@link ErrorKeys.TOKEN_SIGNATURE_INVALID})
 */
function verify(token: string, publicKey: string): void {
    if (!_structureIsValid(token))
        throw new BasaltError({
            messageKey: ErrorKeys.TOKEN_INVALID_STRUCTURE,
            code: 401
        });
    if (isExpired(token))
        throw new BasaltError({
            messageKey: ErrorKeys.TOKEN_IS_EXPIRED,
            code: 401
        });
    const [header, payload, signature]: string[] = token.split('.');
    try {
        if (!ver(null, Buffer.from(`${header}.${payload}`), publicKey, Buffer.from(signature as string, 'base64')))
            throw new BasaltError({
                messageKey: ErrorKeys.TOKEN_SIGNATURE_INVALID,
                code: 401
            });
    } catch (error) {
        throw new BasaltError({
            messageKey: ErrorKeys.TOKEN_SIGNATURE_INVALID,
            detail: error,
            code: 401
        });
    }
}

/**
 * Basalt Token Service provides functions to sign, verify, and extract information from Basalt tokens.
 */
export const basaltToken = {
    getTokenUuid,
    getExpirationDate,
    getAudience,
    getIssuer,
    getHeader,
    getPayload,
    isExpired,
    sign,
    verify,
};
