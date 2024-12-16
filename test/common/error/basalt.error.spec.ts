import { describe, expect, test } from 'bun:test';

import { BasaltError, type BasaltErrorOptions } from '../../../source/common/error/basalt.error.ts';
import { GLOBAL_ERRORS } from '../../../source/common/error/global.error.ts';


describe('BasaltError', () => {
    describe('constructor', () => {
        test('should create a new BasaltError instance with specific properties when valid options are provided', () => {
            const basaltErrorOptions: BasaltErrorOptions<{ token: string }> = {
                key: GLOBAL_ERRORS.TOKEN_INVALID_STRUCTURE,
                cause: { token: 'invalidToken' },
            };
            const basaltError: BasaltError<{ token: string }> = new BasaltError(basaltErrorOptions);
            expect(basaltError).toBeInstanceOf(BasaltError);
            expect(basaltError).toHaveProperty('cause', { token: 'invalidToken' });
            expect(basaltError).toHaveProperty('code', 401);
            expect(basaltError).toHaveProperty('column');
            expect(basaltError).toHaveProperty('date');
            expect(basaltError).toHaveProperty('fileName');
            expect(basaltError).toHaveProperty('line');
            expect(basaltError).toHaveProperty('message', 'error.basalt-auth.token_invalid_structure');
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
                expect(error.stack).toBeDefined();
                expect(error.stack).toContain('BasaltError');
            }
        });

        test('should include fileName, line, and column information if available', () => {
            try {
                throw new BasaltError();
            } catch (error) {
                expect(error).toBeInstanceOf(BasaltError);
                expect(error.fileName).toBeDefined();
                expect(error.line).toBeDefined();
                expect(error.column).toBeDefined();
                expect(typeof error.fileName).toBe('string');
                expect(typeof error.line).toBe('number');
                expect(typeof error.column).toBe('number');
            }
        });
    });
});
