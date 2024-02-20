/**
 * Interface for the result of the token sign method.
 */
export interface IBasaltTokenSignResult {
    /**
     * The token
     */
    token: string;

    /**
     * UUID of the token
     */
    uuid: string;

    /**
     * Public key of the token for verification
     */
    publicKey: string;
}
