/**
 * BasaltBase64 is a class that provides base64 encoding and decoding.
 * @internal
 */
export class Base64 {
    /**
     * Decodes a base64 string to utf-8
     * @param value - The base64 string to decode.
     * @returns string
     */
    public static decode(value: string): string {
        return Buffer.from(value, 'base64').toString('utf-8');
    }

    /**
     * Encodes a utf-8 string to base64
     * @param value - The utf-8 string to encode.
     * @returns string
     */
    public static encode(value: string): string {
        return Buffer.from(value).toString('base64');
    }
}
