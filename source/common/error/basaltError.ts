import { randomUUID } from 'crypto';

/**
 * Represents the options for the Basalt error.
 */
export interface BasaltErrorOptions {
    /**
     * The error key.
     */
    messageKey: string;

    /**
     * The status code.
     */
    code?: number;

    /**
     * The error detail.
     */
    detail?: unknown;
}

/**
 * BasaltError is a class that represents an error entity with a unique identifier.
 */
export class BasaltError extends Error {
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
     * The error code.
     */
    private readonly _code: number;

    /**
     * The error detail.
     */
    private readonly _detail: unknown;

    /**
     * Creates a new instance of the ErrorEntity class.
     *
     * @param basaltErrorOptions - The options to create the error entity. ({@link BasaltErrorOptions})
     */
    public constructor(basaltErrorOptions: Readonly<BasaltErrorOptions>) {
        super();
        this._code = basaltErrorOptions.code ?? 500;
        this.message = basaltErrorOptions.messageKey;
        this._detail = basaltErrorOptions.detail;
        this.name = 'BasaltError';
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Gets the unique identifier of the error.
     *
     * @returns The unique identifier of the error.
     */
    public get uuidError(): string {
        return this._uuidError;
    }

    /**
     * Gets the date when the error was created.
     *
     * @returns The date when the error was created.
     */
    public get date(): Date {
        return this._date;
    }

    /**
     * Gets the error code.
     *
     * @returns The error code.
     */
    public get code(): number {
        return this._code;
    }

    /**
     * Gets the error detail.
     *
     * @returns The error detail.
     */
    public get detail(): unknown {
        return this._detail;
    }
}
