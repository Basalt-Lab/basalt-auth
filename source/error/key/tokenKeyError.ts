/**
 * Global error key is a list of errors in the global context.
 */
export const TOKEN_KEY_ERROR = {
    TOKEN_INVALID_STRUCTURE: 'basalt-auth.error.token_invalid_structure',
    TOKEN_INVALID_HEADER: 'basalt-auth.error.token_invalid_header',
    TOKEN_INVALID_PAYLOAD: 'basalt-auth.error.token_invalid_payload',
    TOKEN_IS_EXPIRED: 'basalt-auth.error.token_is_expired',
    TOKEN_SIGNATURE_INVALID: 'basalt-auth.error.token_signature_invalid'
} as const;
