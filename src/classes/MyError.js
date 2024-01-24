/**
 * MyError class for representing custom errors.
 * This class extends the native JavaScript Error class.
 *
 * @param {Object | string} props - An object containing the error details or a string representing the error message.
 * @param {string} [props.message] - The error message.
 * @param {string} [props.msg] - The error message.
 * @param {string} [props.type] - The type of error. Allowed values: 'error', 'warning', 'info'.
 * @param {Object} [props.customProps] - Additional customProps.
 * @param {number} [props.statusCode] - The status statusCode of the error.
 *
 * @example
 * const myError = new MyError({ message: 'Something went wrong', type: 'warning', customProps: { key: 'value' }, statusCode: 500 });
 * throw myError;
 * 
 * or
 * 
 * const myError = new MyError('Something went wrong', 500);
 * throw myError;
 *
 * @returns {MyError} An instance of MyError with the specified message, type, customProps, and statusCode.
 */
export default class MyError extends Error {
    constructor(props, statusCode) {
        if (typeof props === 'string') {
            super(props);
            this.msg = props;
            this.type = 'error';  // Default type for string-only constructor
            this.customProps = {};
            this.statusCode = statusCode || 500; // Default statusCode if not provided
        } else {
            super(props.message || props.msg || '');  // Pass an empty string if props.message is undefined
            this.msg = props.message || props.msg || '';
            this.type = props.type || 'error';  // Default type if props.type is undefined
            this.customProps = props.customProps || {};
            this.statusCode = props.statusCode || 500; // Default statusCode if not provided
        }
    }
}