import { describe, expect, test } from 'bun:test';

import { BasaltError } from '#/error/basaltError.ts';

describe('BasaltError', () => {
    describe('constructor', () => {
        test('should create a new BasaltError instance with specific properties when valid options are provided', () => {
            const basaltError = new BasaltError<{ eg: string }>({
                key: ['error.basalt-package.example', 123],
                cause: { eg: 'example' }
            });
            expect(basaltError).toBeInstanceOf(BasaltError);
            expect(basaltError).toHaveProperty('uuid');
            expect(basaltError).toHaveProperty('date');
            expect(basaltError).toHaveProperty('statusCode', 123);
            expect(basaltError).toHaveProperty('fileName');
            expect(basaltError).toHaveProperty('line');
            expect(basaltError).toHaveProperty('column');
            expect(basaltError).toHaveProperty('cause', { eg: 'example' });
            expect(basaltError).toHaveProperty('message', 'error.basalt-package.example');
            expect(basaltError).toHaveProperty('name', 'BasaltError');
            expect(basaltError).toHaveProperty('stack');
        });

        test('should create a new BasaltError instance with default properties when no options are provided', () => {
            const basaltError = new BasaltError();
            expect(basaltError).toBeInstanceOf(BasaltError);
            expect(basaltError).toHaveProperty('uuid');
            expect(basaltError).toHaveProperty('date');
            expect(basaltError).toHaveProperty('statusCode', 500);
            expect(basaltError).toHaveProperty('fileName');
            expect(basaltError).toHaveProperty('line');
            expect(basaltError).toHaveProperty('column');
            expect(basaltError).toHaveProperty('cause', undefined);
            expect(basaltError).toHaveProperty('message', 'error.unknown');
            expect(basaltError).toHaveProperty('name', 'BasaltError');
            expect(basaltError).toHaveProperty('stack');
        });
    });

    describe('toJson', () => {
        test('should return a JSON object with the error properties', () => {
            const basaltError = new BasaltError<{ eg: string }>({
                key: ['error.basalt-package.example', 123],
                cause: { eg: 'example' }
            });
            const json = basaltError.toJSON();
            expect(json).toHaveProperty('name', 'BasaltError');
            expect(json).toHaveProperty('uuid');
            expect(json).toHaveProperty('date');
            expect(json).toHaveProperty('message', 'error.basalt-package.example');
            expect(json).toHaveProperty('statusCode', 123);
            expect(json).toHaveProperty('cause', { eg: 'example' });
            expect(json).toHaveProperty('fileName');
            expect(json).toHaveProperty('line');
            expect(json).toHaveProperty('column');
        });
    });
});
