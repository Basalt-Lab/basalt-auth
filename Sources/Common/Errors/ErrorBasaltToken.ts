import { ErrorEntity } from './ErrorEntity';

/**
 * Represents the error codes for the Basalt token.
 */
export enum BasaltTokenErrorCodes {
    BASALT_TOKEN_INVALID_STRUCTURE = 'BASALT_TOKEN_INVALID_STRUCTURE',
    BASALT_TOKEN_IS_EXPIRED = 'BASALT_TOKEN_IS_EXPIRED',
    BASALT_TOKEN_SIGNATURE_INVALID = 'BASALT_TOKEN_SIGNATURE_INVALID'
}

/**
 * Represents an error that occurs during the token generation process.
 */
export class ErrorBasaltToken extends ErrorEntity {
}