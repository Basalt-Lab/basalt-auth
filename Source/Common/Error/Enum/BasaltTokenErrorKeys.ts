/**
 * Represents the error codes for the Basalt token.
 */
export enum BasaltTokenErrorKeys {
    TOKEN_INVALID_STRUCTURE = 'error.domain.service.basaltToken.token_invalid_structure',
    TOKEN_INVALID_HEADER = 'error.domain.service.basaltToken.token_invalid_header',
    TOKEN_INVALID_PAYLOAD = 'error.domain.service.basaltToken.token_invalid_payload',
    TOKEN_IS_EXPIRED = 'error.domain.service.basaltToken.token_is_expired',
    TOKEN_SIGNATURE_INVALID = 'error.domain.service.basaltToken.token_signature_invalid',
}
