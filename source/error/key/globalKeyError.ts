/**
 * Global error key is a list of errors in the global context.
 */
export const GLOBAL_KEY_ERROR = {
    TOKEN_INVALID_STRUCTURE: ['basalt-auth.error.token_invalid_structure', 401],
    TOKEN_INVALID_HEADER: ['basalt-auth.error.token_invalid_header', 401],
    TOKEN_INVALID_PAYLOAD: ['basalt-auth.error.token_invalid_payload', 401],
    TOKEN_IS_EXPIRED: ['basalt-auth.error.token_is_expired', 401],
    TOKEN_SIGNATURE_INVALID: ['basalt-auth.error.token_signature_invalid', 401]
} as const;
