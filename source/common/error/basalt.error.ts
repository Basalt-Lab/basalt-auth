import { randomUUID } from 'crypto';

/**
 * Represents the options for the Basalt error.
 */
export interface BasaltErrorOptions<T = unknown> {
    /**
     * The error key.
     */
    key?: [string, number] | undefined;
    /**
     * The cause of the error.
     */
    cause?: T;
}

/**
 * Basalt error class that extends the ({@link Error}) class and provides additional properties. (uuidError, date, code, fileName, line, column)
 *
 * @typeparam T - The type of the cause of the error.
 *
 * @example
 * The following example demonstrates how to throw a new instance of the Basalt error.
 * ```typescript
 * try {
 *   throw new BasaltError();
 * } catch (error) {
 *  console.log(error instanceof BasaltError); // true
 *  console.log(error instanceof Error); // true
 *  // u can access to uuidError, date, code, fileName, line, column, message, name, stack, cause
 * }
 * ```
 * @example
 * The following example demonstrates how to create a new instance of the Basalt error with provided type for the cause.
 * ```typescript
 * const basaltError: BasaltError<{ foo: 'bar' }> = new BasaltError({
 *     key: 'error.unknown',
 *     cause: {
 *         foo: 'bar',
 *     },
 * });
 * console.log(basaltError.cause); // { foo: 'bar' } if you make ctrl + space after cause. you will see the properties of the cause
 * ```
 */
export class BasaltError<T = unknown> extends Error {
    public override readonly cause: T | undefined;

    /**
     * The unique identifier of the error.
     * This identifier is used to track the error in the logs.
     */
    private readonly _uuidError: string = randomUUID();

    /**
     * The date when the error was created.
     */
    private readonly _date: Date = new Date();

    /**
     * The error code. (HTTP status code)
     */
    private readonly _code: number;

    /**
     * The fileName where the error occurred (if available).
     */
    private readonly _fileName: string = '';

    /**
     * The line number where the error occurred (if available).
     */
    private readonly _line: number = 0;

    /**
     * The column number where the error occurred (if available).
     */
    private readonly _column: number = 0;

    /**
     * Creates a new instance of the Basalt error.
     *
     * @param basaltErrorOptions - The options for the Basalt error. ({@link BasaltErrorOptions})
     */
    public constructor(basaltErrorOptions?: Readonly<BasaltErrorOptions<T>>) {
        super(basaltErrorOptions?.key?.[0] || 'error.unknown');
        super.name = 'BasaltError';
        this.cause = basaltErrorOptions?.cause;
        this._code = basaltErrorOptions?.key?.[1] || 500;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
            const stackLine = this.stack?.split('\n')[1]?.trim();
            const match = stackLine?.match(/:(\d+):(\d+)\)$/);
            this._fileName = stackLine?.split('(')[1]?.split(':')[0] || '';
            if (match) {
                this._line = match[1] ? parseInt(match[1], 10) : 0;
                this._column = match[2] ? parseInt(match[2], 10) : 0;
            }
        }
    }

    /**
     * Gets the unique identifier of the error.
     */
    public get uuidError(): string {
        return this._uuidError;
    }

    /**
     * Gets the date when the error was created.
     */
    public get date(): Date {
        return this._date;
    }

    /**
     * Gets the fileName where the error occurred (if available).
     */
    public get fileName(): string {
        return this._fileName;
    }

    /**
     * Gets the line number where the error occurred (if available).
     */
    public get line(): number {
        return this._line;
    }

    /**
     * Gets the column number where the error occurred (if available).
     */
    public get column(): number {
        return this._column;
    }

    /**
     * Gets the error code.
     */
    public get code(): number {
        return this._code;
    }
}
