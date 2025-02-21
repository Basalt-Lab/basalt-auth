import { describe, expect, test } from 'bun:test';

import { BasaltError } from '#/error/basaltError.ts';

describe('BasaltError', () => {
    describe('constructor', () => {
        test('should create a new BasaltError instance with specific properties when valid options are provided', () => {
            const basaltError = new BasaltError<{ eg: string }>({
                message: 'An example error',
                key: 'error.basalt-package.example',
                httpStatusCode: 123,
                cause: { eg: 'example' }
            });
            expect(basaltError).toBeInstanceOf(BasaltError);
            expect(basaltError).toHaveProperty('uuid');
            expect(basaltError).toHaveProperty('date');
            expect(basaltError).toHaveProperty('key', 'error.basalt-package.example');
            expect(basaltError).toHaveProperty('httpStatusCode', 123);
            expect(basaltError).toHaveProperty('cause', { eg: 'example' });
            expect(basaltError).toHaveProperty('message', 'An example error');
            expect(basaltError).toHaveProperty('name', 'BasaltError');
            expect(basaltError).toHaveProperty('stack');
        });

        test('should create a new BasaltError instance with default properties when no options are provided', () => {
            const basaltError = new BasaltError();
            expect(basaltError).toBeInstanceOf(BasaltError);
            expect(basaltError).toHaveProperty('uuid');
            expect(basaltError).toHaveProperty('date');
            expect(basaltError).toHaveProperty('key', '');
            expect(basaltError).toHaveProperty('httpStatusCode', 500);
            expect(basaltError).toHaveProperty('cause', undefined);
            expect(basaltError).toHaveProperty('message', '');
            expect(basaltError).toHaveProperty('name', 'BasaltError');
            expect(basaltError).toHaveProperty('stack');
        });
    });
});
