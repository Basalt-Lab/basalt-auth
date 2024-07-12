/**
 * Decodes a base64 string to utf-8
 *
 * @param value - The base64 string to decode.
 *
 * @returns The decoded utf-8 string.
 */
function base64Decode(value: string): string {
    return Buffer.from(value, 'base64').toString('utf-8');
}

/**
 * Encodes a utf-8 string to base64
 *
 * @param value - The utf-8 string to encode.
 *
 * @returns The encoded base64 string.
 */
function base64Encode(value: string): string {
    return Buffer.from(value).toString('base64');
}

export { base64Decode, base64Encode };
