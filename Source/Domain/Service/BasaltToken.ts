import { randomUUID, sign, verify } from 'crypto';

import { BasaltError } from '@/Common/Error/index.js';
import { BasaltTokenErrorKeys } from '@/Common/Error/Enum/index.js';

import { base64Decode, base64Encode, generateKeyPairED25519 } from '@/Common/Util/index.js';
import type { IKeyPairED25519 } from '@/Common/Util/Interfaces/index.js';
import type { IBasaltTokenHeader, IBasaltTokenSignResult } from '@/Domain/Service/Interface/index.js';

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
 * Class to manage the creation, signing, and verification of authentication tokens.
 */
export class BasaltToken {
    /**
     * Retrieves the unique identifier (UUID) from the token.
     *
     * @param token - The authentication token.
     *
     * @throws ({@link BasaltError}) If the token structure is invalid. ({@link BasaltTokenErrorKeys.TOKEN_INVALID_STRUCTURE})
     *
     * @returns The UUID of the token.
     */
    public getTokenUuid(token: string): string {
        return this.getHeader(token).uuid;
    }

    /**
     * Get the token expiration date
     *
     * @param token - The authentication token.
     *
     * @throws ({@link BasaltError}) If the token structure is invalid. ({@link BasaltTokenErrorKeys.TOKEN_INVALID_STRUCTURE})
     *
     * @returns The expiration date of the token.
     */
    public getExpirationDate(token: string): Date {
        return new Date(this.getHeader(token).exp);
    }

    /**
     * Get the token audience
     *
     * @param token - The authentication token.
     *
     * @throws ({@link BasaltError}) If the token structure is invalid. ({@link BasaltTokenErrorKeys.TOKEN_INVALID_STRUCTURE})
     *
     * @returns The intended audience of the token.
     */
    public getAudience(token: string): string {
        return this.getHeader(token).audience;
    }

    /**
     * Get the token issuer
     *
     * @param token - The authentication token.
     *
     * @throws ({@link BasaltError} If the token structure is invalid. ({@link BasaltTokenErrorKeys.TOKEN_INVALID_STRUCTURE})
     *
     * @returns The issuer of the token.
     */
    public getIssuer(token: string): string {
        return this.getHeader(token).issuer;
    }

    /**
     * Parses the token header and returns it.
     *
     * @param token - The authentication token.
     *
     * @throws ({@link BasaltError}) If the token structure is invalid. ({@link BasaltTokenErrorKeys.TOKEN_INVALID_STRUCTURE})
     *
     * @returns The parsed header of the token. ({@link IBasaltTokenHeader})
     */
    public getHeader(token: string): IBasaltTokenHeader {
        if (!this._structureIsValid(token))
            throw new BasaltError({
                messageKey: BasaltTokenErrorKeys.TOKEN_INVALID_STRUCTURE
            });
        const [header]: string[] = token.split('.');
        return JSON.parse(
            base64Decode(header as string)
        ) as IBasaltTokenHeader;
    }

    /**
     * Parses the token payload and returns it.
     *
     * @typeParam T - The expected type of the payload.
     *
     * @param token - The authentication token.
     *
     * @throws ({@link BasaltError}) If the token structure is invalid. ({@link BasaltTokenErrorKeys.TOKEN_INVALID_STRUCTURE})
     *
     * @returns The parsed payload of the token. ({@link T})
     */
    public getPayload<T extends object>(token: string): T {
        if (!this._structureIsValid(token))
            throw new BasaltError({
                messageKey: BasaltTokenErrorKeys.TOKEN_INVALID_STRUCTURE
            });
        const [, payload]: string[] = token.split('.');
        return JSON.parse(
            base64Decode(payload as string)
        ) as T;
    }

    /**
     * Determines whether the token has expired.
     *
     * @param token - The authentication token.
     *
     * @throws ({@link BasaltError}) If the token structure is invalid. ({@link BasaltTokenErrorKeys.TOKEN_INVALID_STRUCTURE})
     *
     * @returns True if the token has expired, false otherwise.
     */
    public isExpired(token: string): boolean {
        return new Date(this.getHeader(token).exp) < new Date();
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
     * @returns An object containing the signed token, its UUID, and the public key. (The private key is not returned for security reasons, save only the public key and the UUID of the token.) ({@link IBasaltTokenSignResult})
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
    public sign<T extends object>(
        payload: T,
        expirationMs: number = BasaltTokenExpiry.ONE_HOUR,
        issuer: string = 'Basalt-Issuer',
        audience: string = 'Basalt-Audience'
    ): IBasaltTokenSignResult {
        const tokenUUid: string = randomUUID();
        const keyPair: IKeyPairED25519 = generateKeyPairED25519();

        const headerStringify: string = this._buildHeader(tokenUUid, expirationMs, issuer, audience);
        const payloadStringify: string = this._buildPayload(payload);
        const signature: string = this._buildSignature(headerStringify, payloadStringify, keyPair.privateKey, keyPair.passphrase);

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
     * @throws ({@link BasaltError}) If the token structure is invalid. ({@link BasaltTokenErrorKeys.TOKEN_INVALID_STRUCTURE})
     * @throws ({@link BasaltError}) If the token has expired. ({@link BasaltTokenErrorKeys.TOKEN_IS_EXPIRED})
     * @throws ({@link BasaltError}) If the token signature is invalid. ({@link BasaltTokenErrorKeys.TOKEN_SIGNATURE_INVALID})
     */
    public verify(token: string, publicKey: string): void {
        if (!this._structureIsValid(token))
            throw new BasaltError({
                messageKey: BasaltTokenErrorKeys.TOKEN_INVALID_STRUCTURE
            });
        if (this.isExpired(token))
            throw new BasaltError({
                messageKey: BasaltTokenErrorKeys.TOKEN_IS_EXPIRED
            });
        const [header, payload, signature]: string[] = token.split('.');
        if (!verify(null, Buffer.from(`${header}.${payload}`), publicKey, Buffer.from(signature as string, 'base64')))
            throw new BasaltError({
                messageKey: BasaltTokenErrorKeys.TOKEN_SIGNATURE_INVALID
            });
    }

    /**
     * Validates the structure of the provided token.
     * A valid token must contain three parts separated by dots: header, payload, and signature.
     *
     * @param token - The authentication token to validate.
     *
     * @returns True if the token structure is valid, false otherwise.
     */
    private _structureIsValid(token: string): boolean {
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
    private _buildHeader(tokenUUid: string, expirationMs: number, issuer: string, audience: string): string {
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
    private _buildPayload<T extends object>(payload: T): string {
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
    private _buildSignature(header: string, payload: string, privateKey: string, passphrase: string): string {
        return sign(null, Buffer.from(`${header}.${payload}`), {
            key: privateKey,
            passphrase
        }).toString('base64');
    }
}
