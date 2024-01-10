/**
 * MyError class for representing custom errors.
 * This class extends the native JavaScript Error class.
 *
 * @param {string} message - The error message.
 * @param {string} [type='error'] - The type of error. Allowed values: 'error', 'warning', 'info'. `Default: 'error'`
 *
 * @example
 * throw new MyError('Something went wrong', 'warning');
 *
 * @returns {MyError} An instance of MyError with the specified message and type.
 */
export default class MyError extends Error {
    constructor(message, type = 'error') {
        super(message);

        if (!['error', 'warning', 'info'].includes(type)) {
            throw new MyError('Invalid error type. Allowed types are error, warning, and info.');
        }

        this.type = type;
    }
}