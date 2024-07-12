import { randomUUID } from 'crypto';

import type { IBasaltErrorOptions } from '@/Common/Interface/index.js';

/**
 * BasaltError is a class that represents an error entity with a unique identifier.
 */
export class BasaltError extends Error {
    /**
     * The unique identifier of the error.
     * This identifier is used to track the error in the logs.
     * @readonly
     */
    private readonly _uuidError: string = randomUUID();

    /**
     * The date when the error was created.
     * @readonly
     */
    private readonly _date: Date = new Date();

    /**
     * The error code.
     * @readonly
     */
    private readonly _code: number;
    /**
     * The error detail.
     * @readonly
     */
    private readonly _detail: unknown;

    /**
     * Creates a new instance of the ErrorEntity class.
     *
     * @param basaltErrorOptions - The options to create the error entity. ({@link IBasaltErrorOptions})
     */
    public constructor(basaltErrorOptions: Readonly<IBasaltErrorOptions>) {
        super();
        this._code = basaltErrorOptions.code ?? 500;
        this.message = basaltErrorOptions.messageKey;
        this._detail = basaltErrorOptions.detail;
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Gets the unique identifier of the error.
     * @readonly
     * @returns The unique identifier of the error.
     */
    public get uuidError(): string {
        return this._uuidError;
    }

    /**
     * Gets the date when the error was created.
     * @readonly
     * @returns The date when the error was created.
     */
    public get date(): Date {
        return this._date;
    }

    /**
     * Gets the error code.
     * @readonly
     * @returns The error code.
     */
    public get code(): number {
        return this._code;
    }

    /**
     * Gets the error detail.
     * @readonly
     * @returns The error detail.
     */
    public get detail(): unknown {
        return this._detail;
    }
}
