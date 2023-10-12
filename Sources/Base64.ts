export class Base64 {
    /**
     * Decodes a base64 string to utf-8
     * @param value
     * @returns {string}
     */
    public static decode(value: string): string {
        return Buffer.from(value, 'base64').toString('utf-8');
    }

    /**
     * Encodes a utf-8 string to base64
     * @param value
     * @returns {string}
     */
    public static encode(value: string): string {
        return Buffer.from(value).toString('base64');
    }
}
