import { describe, expect, test } from 'bun:test';

import { BasaltError, type BasaltErrorOptions } from '#/error/basaltError.ts';


describe('BasaltError', () => {
    describe('constructor', () => {
        test('should create a new BasaltError instance with specific properties when valid options are provided', () => {
            const basaltErrorOptions: BasaltErrorOptions<{ token: string }> = {
                key: ['error.basalt-helper.example', 500],
                cause: { token: 'invalidToken' }
            };
            const basaltError = new BasaltError<{ token: string }>(basaltErrorOptions);
            expect(basaltError).toBeInstanceOf(BasaltError);
            expect(basaltError).toHaveProperty('cause', { token: 'invalidToken' });
            expect(basaltError).toHaveProperty('code', 500);
            expect(basaltError).toHaveProperty('column');
            expect(basaltError).toHaveProperty('date');
            expect(basaltError).toHaveProperty('fileName');
            expect(basaltError).toHaveProperty('line');
            expect(basaltError).toHaveProperty('message', 'error.basalt-helper.example');
            expect(basaltError).toHaveProperty('name', 'BasaltError');
            expect(basaltError).toHaveProperty('stack');
            expect(basaltError).toHaveProperty('uuidError');
        });

        test('should create a new BasaltError instance with default code and message when key is undefined', () => {
            const basaltError: BasaltError = new BasaltError();
            expect(basaltError).toBeInstanceOf(BasaltError);
            expect(basaltError).toHaveProperty('cause', undefined);
            expect(basaltError).toHaveProperty('code', 500);
            expect(basaltError).toHaveProperty('column');
            expect(basaltError).toHaveProperty('date');
            expect(basaltError).toHaveProperty('fileName');
            expect(basaltError).toHaveProperty('line');
            expect(basaltError).toHaveProperty('message', 'error.unknown');
            expect(basaltError).toHaveProperty('name', 'BasaltError');
            expect(basaltError).toHaveProperty('stack');
            expect(basaltError).toHaveProperty('uuidError');
        });

        test('should provide a stack trace when the error is thrown', () => {
            try {
                throw new BasaltError();
            } catch (error) {
                expect(error).toBeInstanceOf(BasaltError);
                if (error instanceof BasaltError) {
                    expect(error.stack).toBeDefined();
                    expect(error.stack).toContain('BasaltError');
                }
            }
        });

        test('should include fileName, line, and column information if available', () => {
            try {
                throw new BasaltError();
            } catch (error) {
                expect(error).toBeInstanceOf(BasaltError);
                if (error instanceof BasaltError) {
                    expect(error.fileName).toBeDefined();
                    expect(error.line).toBeDefined();
                    expect(error.column).toBeDefined();
                    expect(typeof error.fileName).toBe('string');
                    expect(typeof error.line).toBe('number');
                    expect(typeof error.column).toBe('number');
                }
            }
        });
    });
});
