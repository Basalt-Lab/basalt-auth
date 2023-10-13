import { IBasaltTokenHeader, IKeyPairED25519, IBasaltTokenSignResult } from '@/Interfaces';
import { KeyGenerator } from '@/KeyGenerator';
import { Crypto, Json } from '@basalt-lab/basalt-core';
import { Base64 } from '@/Base64';

export class BasaltToken {

    /**
     * Check if the token structure is valid
     * @param token
     * @private
     * @returns {boolean}
     */
    private structureIsValid(token: string): boolean {
        const [header, payload, signature]: string[] = token.split('.');
        return !(!header || !payload || !signature);
    }

    /**
     * Build the token header
     * @param tokenUUid
     * @param expirationMs
     * @param issuer
     * @param audience
     * @private
     * @returns {string}
     */
    private buildHeader(tokenUUid: string, expirationMs: number, issuer: string, audience: string): string {
        return Base64.encode(Json.stringify({
            uuid: tokenUUid,
            exp: new Date(Date.now() + expirationMs),
            issuer,
            audience
        }));
    }

    /**
     * Build the token payload
     * @param payload
     * @private
     * @returns {string}
     */
    private buildPayload<T extends object>(payload: T): string {
        return Base64.encode(Json.stringify(payload));
    }

    /**
     * Build the token signature
     * @param header
     * @param payload
     * @param privateKey
     * @param passPhrase
     * @private
     * @returns {string}
     */
    private buildSignature(header: string, payload: string, privateKey: string, passPhrase: string): string {
        return Crypto.sign(header + '.' + payload, privateKey, passPhrase);
    }

    /**
     * Get the token uuid
     * @param token
     * @returns {string}
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
     * Get the token header
     * @param token
     * @returns {IBasaltTokenHeader}
     * @throws {Error}
     */
    public getHeader(token: string): IBasaltTokenHeader {
        if (!this.structureIsValid(token))
            throw new Error('Invalid token structure');
        const [header]: string[] = token.split('.');
        return Json.parse(Base64.decode(header));
    }

    /**
     * Get the token payload
     * @param token
     * @returns {T}
     * @throws {Error}
     */
    public getPayload<T extends object>(token: string): T {
        if (!this.structureIsValid(token))
            throw new Error('Invalid token structure');
        const [, payload]: string[] = token.split('.');
        return Json.parse(Base64.decode(payload));
    }

    /**
     * Check if the token is expired
     * @param token
     * @returns {boolean}
     */
    public isExpired(token: string): boolean {
        return new Date(this.getHeader(token).exp) < new Date();
    }

    /**
     * Sign a token
     * @param expirationMs
     * @param payload
     * @param issuer
     * @param audience
     * @param keyPair
     * @returns {IBasaltTokenSignResult}
     */
    public sign<T extends object>(
        expirationMs: number,
        payload: T,
        issuer: string = 'YourAppName-Issuer',
        audience: string = 'YourAppName-Audience',
        keyPair: IKeyPairED25519 = new KeyGenerator().generateKeyPairED25519()
    ): IBasaltTokenSignResult {
        const tokenUUid: string = Crypto.randomUUID();

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
     * Verify a token signature and expiration date
     * @param token
     * @param publicKey
     * @throws {Error}
     */
    public verify(token: string, publicKey: string): void {
        if (!this.structureIsValid(token))
            throw new Error('Invalid token structure');
        if (this.isExpired(token))
            throw new Error('Token expired');

        const [header, payload, signature]: string[] = token.split('.');
        if (!Crypto.verify(header + '.' + payload, signature, publicKey))
            throw new Error('Invalid token signature');
    }
}
