import { randomUUIDv7 } from 'bun';

/**
 * Represents the options for the Basalt error.
 */
export interface BasaltErrorOptions<T = unknown> {
    /**
     * The error key.
     */
    key?: readonly [string, number] | undefined;
    /**
     * The cause of the error.
     */
    cause?: T;
}

/**
 * Basalt error class that extends the ({@link Error}) class and provides additional properties. (uuidError, date, code, fileName, line, column)
 *
 * @typeParam T - The type of the cause of the error.
 *
 * @example
 * The following example demonstrates how to throw a new instance of the Basalt error.
 * ```typescript
 * try {
 *   throw new BasaltError();
 * } catch (error) {
 *  console.log(error instanceof BasaltError); // true
 *  console.log(error instanceof Error); // true
 *  // u can access to uuidError, date, code, fileName, line, column, message, name, stack, cause, toJSON
 * }
 * ```
 * @example
 * The following example demonstrates how to create a new instance of the Basalt error with provided type for the cause.
 * ```typescript
 * // { foo: 'bar' } is the type of the cause;
 * const basaltError: BasaltError<{ foo: 'bar' }> = new BasaltError({
 *     key: 'error.unknown',
 *     cause: {
 *         foo: 'bar',
 *     },
 * });
 * console.log(basaltError.cause); // { foo: 'bar' }
 * ```
 */
export class BasaltError<const T = unknown> extends Error {
    /**
     * The cause of the error. (if available)
     */
    public override readonly cause: T | undefined;

    /**
     * The unique identifier of the error.
     * This identifier is used to track the error in the logs.
     */
    private readonly _uuid: string = randomUUIDv7();

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
        const stackLine = this.stack?.split('\n')[1]?.trim();
        const match = stackLine?.match(/\(?(.+):(\d+):(\d+)\)?$/);
        if (match) {
            this._fileName = match[1] || '';
            this._line = parseInt(match[2], 10) || 0;
            this._column = parseInt(match[3], 10) || 0;
        }
    }

    /**
     * The unique identifier of the error.
     */
    public get uuid(): string {
        return this._uuid;
    }

    /**
     * The date when the error was created.
     */
    public get date(): Date {
        return this._date;
    }

    /**
     * The error code. (HTTP status code)
     */
    public get code(): number {
        return this._code;
    }

    /**
     * The fileName where the error occurred (if available).
     */
    public get fileName(): string {
        return this._fileName;
    }

    /**
     * The line number where the error occurred (if available).
     */
    public get line(): number {
        return this._line;
    }

    /**
     * The column number where the error occurred (if available).
     */
    public get column(): number {
        return this._column;
    }

    /**
     * Converts the error object to a JSON object.
     *
     * @returns The error object as a JSON object.
     */
    public toJSON(): {
        name: string;
        uuid: string;
        date: Date;
        message: string;
        code: number;
        cause: T | undefined;
        fileName: string;
        line: number;
        column: number;
    } {
        return {
            name: this.name,
            uuid: this._uuid,
            date: this._date,
            message: this.message,
            code: this._code,
            cause: this.cause,
            fileName: this._fileName,
            line: this._line,
            column: this._column
        };
    }
}
