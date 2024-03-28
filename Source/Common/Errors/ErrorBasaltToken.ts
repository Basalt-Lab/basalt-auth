import { ErrorEntity } from './ErrorEntity';

/**
 * Represents the error codes for the Basalt token.
 */
export enum BasaltTokenErrorCodes {
    TOKEN_INVALID_STRUCTURE = 'TOKEN_INVALID_STRUCTURE',
    TOKEN_IS_EXPIRED = 'TOKEN_IS_EXPIRED',
    TOKEN_SIGNATURE_INVALID = 'TOKEN_SIGNATURE_INVALID'
}

/**
 * Represents an error that occurs during the token generation process.
 */
export class ErrorBasaltToken extends ErrorEntity {}