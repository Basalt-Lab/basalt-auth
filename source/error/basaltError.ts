import { randomUUIDv7 } from 'bun';

/**
 * Represents the options for the Basalt error.
 */
export interface BasaltErrorOptions<T = unknown> {
    /**
     * The error message describing what went wrong.
     */
    message?: string;

    /**
     * A unique key identifying the type of error, useful for localization or error handling.
     */
    key?: string;

    /**
     * The HTTP status code associated with the error, typically used in API responses.
     */
    httpStatusCode?: number;

    /**
     * The cause of the error, which can be an original error or additional context.
     */
    cause?: T;
}

/**
 * A custom error class that extends the native {@link Error} class, providing additional properties
 * such as a unique identifier, error key, HTTP status code, and cause.
 *
 * @typeParam T - The type of the cause of the error, which can be any object or error.
 *
 * @example
 * The following example demonstrates how to throw and catch a BasaltError.
 * ```typescript
 * try {
 *   throw new BasaltError({
 *     message: 'An error occurred',
 *     key: 'example.error',
 *     httpStatusCode: 400,
 *     cause: new Error('Original error')
 *   });
 * } catch (error) {
 *   if (error instanceof BasaltError) {
 *     console.error(`Error UUID: ${error.uuid}`);
 *     console.error(`Error Date: ${error.date}`);
 *     console.error(`Error Key: ${error.key}`);
 *     console.error(`HTTP Status Code: ${error.httpStatusCode}`);
 *     console.error(`Cause: ${error.cause}`);
 *   }
 * }
 * ```
 *
 * @example
 * The following example demonstrates how to create a BasaltError with a custom cause type.
 * ```typescript
 * const basaltError = new BasaltError<{ foo: string }>({
 *     message: 'Custom error with cause',
 *     key: 'basalt-package.error.custom_error',
 *     httpStatusCode: 500,
 *     cause: { foo: 'bar' },
 * });
 * console.log(basaltError.cause); // { foo: 'bar' }
 * ```
 */
export class BasaltError<const T = unknown> extends Error {
    /**
     * The cause of the error, typically used to store the original error or additional context.
     */
    public override readonly cause: T | undefined;

    /**
     * The unique identifier of the error, automatically generated using UUID v7.
     * This identifier is particularly useful for tracking errors in logs.
     */
    private readonly _uuid: string = randomUUIDv7();

    /**
     * The date when the error was created, automatically set to the current date and time.
     */
    private readonly _date: Date = new Date();

    /**
     * A unique key identifying the type of error, useful for localization or error handling.
     */
    private readonly _key: string;

    /**
     * The HTTP status code associated with the error, typically used in API responses.
     */
    private readonly _httpStatusCode: number;

    /**
     * Creates a new instance of the BasaltError class.
     *
     * @param basaltErrorOptions - The options for the Basalt error. ({@link BasaltErrorOptions})
     */
    public constructor(basaltErrorOptions?: Readonly<BasaltErrorOptions<T>>) {
        super(basaltErrorOptions?.message);
        super.name = 'BasaltError';
        this.cause = basaltErrorOptions?.cause;
        this._key = basaltErrorOptions?.key || '';
        this._httpStatusCode = basaltErrorOptions?.httpStatusCode || 500;
    }

    /**
     * Gets the unique identifier of the error.
     * @returns The UUID of the error.
     */
    public get uuid(): string {
        return this._uuid;
    }

    /**
     * Gets the date when the error was created.
     * @returns The creation date of the error.
     */
    public get date(): Date {
        return this._date;
    }

    /**
     * Gets the error key, which identifies the type of error.
     * @returns The key associated with the error.
     */
    public get key(): string {
        return this._key;
    }

    /**
     * Gets the HTTP status code associated with the error.
     * @returns The HTTP status code.
     */
    public get httpStatusCode(): number {
        return this._httpStatusCode;
    }
}