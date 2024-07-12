/**
 * Interface for the ED25519 key pair.
 */
export interface IKeyPairED25519 {
    /**
     * The public key.
     */
    publicKey: string;
    /**
     * The private key.
     */
    privateKey: string;
    /**
     * The passphrase.
     */
    passphrase: string;
}
