import { randomUUID, sign, verify } from 'crypto';

import { IBasaltTokenHeader, IBasaltKeyPairED25519, IBasaltTokenSignResult } from '@/Interfaces';
import { BasaltKeyGenerator } from '@/BasaltKeyGenerator';
import { BasaltBase64 } from '@/BasaltBase64';

/**
 * Class to manage the creation, signing, and verification of authentication tokens.
 */
export class BasaltToken {

    /**
     * Validates the structure of the provided token.
     * A valid token must contain three parts separated by dots: header, payload, and signature.
     *
     * @param {string} token - The authentication token to validate.
     * @returns {boolean} True if the token structure is valid, false otherwise.
     * @private
     */
    private structureIsValid(token: string): boolean {
        const [header, payload, signature]: string[] = token.split('.');
        return !(!header || !payload || !signature);
    }

    /**
     * Constructs a token header with necessary claims.
     *
     * @param {string} tokenUUid - The unique identifier for the token.
     * @param {number} expirationMs - The token's expiry time in milliseconds from the current time.
     * @param {string} issuer - The issuer claim identifies the principal that issued the token.
     * @param {string} audience - The audience claim identifies the recipients that the token is intended for.
     * @returns {string} A Base64-encoded JSON string representing the token header.
     * @private
     */
    private buildHeader(tokenUUid: string, expirationMs: number, issuer: string, audience: string): string {
        return BasaltBase64.encode(JSON.stringify({
            uuid: tokenUUid,
            exp: new Date(Date.now() + expirationMs),
            issuer,
            audience
        }));
    }

    /**
     * Constructs a token payload.
     *
     * @param {T} payload - The payload of the token, containing the claims about the entity (typically the user).
     * @returns {string} A Base64-encoded JSON string representing the token payload.
     * @private
     * @template T - The type of the payload.
     */
    private buildPayload<T extends object>(payload: T): string {
        return BasaltBase64.encode(JSON.stringify(payload));
    }

    /**
     * Constructs a token signature using the provided header, payload, and private key.
     *
     * @param {string} header - The Base64-encoded token header.
     * @param {string} payload - The Base64-encoded token payload.
     * @param {string} privateKey - The private key used to sign the token.
     * @param {string} passphrase - The passphrase of the private key, if applicable.
     * @returns {string} The token's digital signature.
     * @private
     */
    private buildSignature(header: string, payload: string, privateKey: string, passphrase: string): string {
        return sign(null, Buffer.from(header + '.' + payload), {
            key: privateKey,
            passphrase
        }).toString('base64');
    }

    /**
     * Retrieves the unique identifier (UUID) from the token.
     *
     * @param {string} token - The authentication token.
     * @returns {string} The UUID of the token.
     * @throws {Error} If the token structure is invalid.
     */
    public getTokenUuid(token: string): string {
        return this.getHeader(token).uuid;
    }

    /**
     * Get the token expiration date
     * @param token
     * @returns {Date}
     */
    public getExpirationDate(token: string): Date {
        return new Date(this.getHeader(token).exp);
    }

    /**
     * Get the token audience
     * @param token
     * @returns {string}
     */
    public getAudience(token: string): string {
        return this.getHeader(token).audience;
    }

    /**
     * Get the token issuer
     * @param token
     * @returns {string}
     */
    public getIssuer(token: string): string {
        return this.getHeader(token).issuer;
    }

    /**
     * Parses the token header and returns it.
     *
     * @param {string} token - The authentication token.
     * @returns {IBasaltTokenHeader} The parsed header of the token.
     * @throws {Error} If the token structure is invalid.
     */
    public getHeader(token: string): IBasaltTokenHeader {
        if (!this.structureIsValid(token))
            throw new Error('Invalid token structure');
        const [header]: string[] = token.split('.');
        return JSON.parse(BasaltBase64.decode(header));
    }

    /**
     * Parses the token payload and returns it.
     *
     * @param {string} token - The authentication token.
     * @returns {T} The parsed payload of the token.
     * @throws {Error} If the token structure is invalid.
     * @template T - The expected type of the payload.
     */
    public getPayload<T extends object>(token: string): T {
        if (!this.structureIsValid(token))
            throw new Error('Invalid token structure');
        const [, payload]: string[] = token.split('.');
        return JSON.parse(BasaltBase64.decode(payload));
    }

    /**
     * Determines whether the token has expired.
     *
     * @param {string} token - The authentication token.
     * @returns {boolean} True if the token has expired, false otherwise.
     */
    public isExpired(token: string): boolean {
        return new Date(this.getHeader(token).exp) < new Date();
    }

    /**
     * Sign a token with the provided payload, issuer, audience, and key pair.
     *
     * @param {number} expirationMs - The amount of milliseconds after which the token should expire.
     * @param {T} payload - The payload of the token, which contains the claims for the token.
     * @param {string} [issuer='YourAppName-Issuer'] - The issuer of the token, default is 'YourAppName-Issuer'.
     * @param {string} [audience='YourAppName-Audience'] - The intended audience of the token, default is 'YourAppName-Audience'.
     * @param {IBasaltKeyPairED25519} [keyPair=new BasaltKeyGenerator().generateKeyPairED25519()] - The ED25519 key pair to sign the token with.
     *
     * @returns {IBasaltTokenSignResult} - An object containing the signed token, its UUID, and the public key.
     *
     * @throws {Error} If the key pair is invalid or the token cannot be signed for any other reason.
     *
     * @example
     * const tokenResult = basaltToken.sign(3600000, { user: 'johndoe' }, 'MyApp', 'MyAppAudience');
     * console.log(tokenResult.token); // The signed token
     *
     * @template T - The type of the payload.
     */
    public sign<T extends object>(
        expirationMs: number,
        payload: T,
        issuer: string = 'YourAppName-Issuer',
        audience: string = 'YourAppName-Audience',
        keyPair: IBasaltKeyPairED25519 = new BasaltKeyGenerator().generateKeyPairED25519()
    ): IBasaltTokenSignResult {
        const tokenUUid: string = randomUUID();

        const headerStringify: string = this.buildHeader(tokenUUid, expirationMs, issuer, audience);
        const payloadStringify: string = this.buildPayload(payload);
        const signature: string = this.buildSignature(headerStringify, payloadStringify, keyPair.privateKey, keyPair.passphrase);

        return {
            token: `${headerStringify}.${payloadStringify}.${signature}`,
            uuid: tokenUUid,
            publicKey: keyPair.publicKey,
        };
    }

    /**
     * Verifies the signature and expiration date of the token.
     *
     * @param {string} token - The authentication token to verify.
     * @param {string} publicKey - The public key corresponding to the private key used to sign the token.
     * @throws {Error} If the token structure is invalid, if the token has expired, or if the signature does not match.
     */
    public verify(token: string, publicKey: string): void {
        if (!this.structureIsValid(token))
            throw new Error('Invalid token structure');
        if (this.isExpired(token))
            throw new Error('Token expired');

        const [header, payload, signature]: string[] = token.split('.');
        if (!verify(null, Buffer.from(header + '.' + payload), publicKey, Buffer.from(signature, 'base64')))
            throw new Error('Invalid token signature');
    }
}
