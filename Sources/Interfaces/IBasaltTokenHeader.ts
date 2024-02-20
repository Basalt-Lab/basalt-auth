/**
 * Interface for the Basalt Token Header
 */
export interface IBasaltTokenHeader {
    /**
     * Expiration time of the token
     */
    exp: number;

    /**
     * uuid of the token
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
