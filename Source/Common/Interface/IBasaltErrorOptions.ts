/**
 * Represents the options for the Basalt error.
 */
export interface IBasaltErrorOptions {
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
