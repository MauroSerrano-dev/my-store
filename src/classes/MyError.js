/**
 * MyError class for representing custom errors.
 * This class extends the native JavaScript Error class.
 *
 * @param {Object} props - An object containing the error details.
 * @param {string} props.message - The error message.
 * @param {string} [props.type] - The type of error. Allowed values: 'error', 'warning', 'info'. Default: 'error'
 * @param {Object} [props.options] - Additional options.
 *
 * @example
 * const myError = new MyError({ message: 'Something went wrong', type: 'warning', options: { key: 'value' } });
 * throw myError;
 *
 * @returns {MyError} An instance of MyError with the specified message, type, and options.
 */
export default class MyError extends Error {
    constructor({ message, type = 'error', options = {} }) {
        super(message);

        if (!['error', 'warning', 'info'].includes(type)) {
            throw new MyError({ message: 'Invalid error type. Allowed types are error, warning, and info' });
        }

        this.type = type;
        this.options = options;
    }
}