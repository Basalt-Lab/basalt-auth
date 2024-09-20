/**
 * Interface for the Basalt Token Header
 */
export interface BasaltTokenHeader {
    /**
     * Expiration time of the token
     */
    exp: number;

    /**
     * UUID of the token
     */
    uuid: string;

    /**
     * Issuer of the token
     */
    issuer: string;

    /**
     * Audience of the token
     */
    audience: string;
}
