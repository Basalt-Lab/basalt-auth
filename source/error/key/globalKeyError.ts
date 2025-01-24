/**
 * Global error key is a list of errors in the global context.
 */
export const GLOBAL_KEY_ERROR = {
    TOKEN_INVALID_STRUCTURE: ['error.basalt-auth.token_invalid_structure', 401],
    TOKEN_INVALID_HEADER: ['error.basalt-auth.token_invalid_header', 401],
    TOKEN_INVALID_PAYLOAD: ['error.basalt-auth.token_invalid_payload', 401],
    TOKEN_IS_EXPIRED: ['error.basalt-auth.token_is_expired', 401],
    TOKEN_SIGNATURE_INVALID: ['error.basalt-auth.token_signature_invalid', 401]
} as const;
