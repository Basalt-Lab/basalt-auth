import { base64Decode, base64Encode } from '@/App';

describe('Base64', () => {
    describe('base64Decode', () => {
        it('should decode a base64 string', () => {
            const encodedString: string = 'SGVsbG8gV29ybGQ=';
            const decodedString: string = base64Decode(encodedString);
            expect(decodedString).toBe('Hello World');
        });
    });

    describe('base64Encode', () => {
        it('should encode a string to base64', () => {
            const decodedString: string = 'Hello World';
            const encodedString: string = base64Encode(decodedString);
            expect(encodedString).toBe('SGVsbG8gV29ybGQ=');
        });
    });
});