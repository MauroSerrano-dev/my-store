/**
 * MyError class for representing custom errors.
 * This class extends the native JavaScript Error class.
 *
 * @param {Object | string} props - An object containing the error details or a string representing the error message.
 * @param {string} [props.message] - The error message.
 * @param {string} [props.type='error'] - The type of error. Allowed values: 'error', 'warning', 'info'.
 * @param {Object} [props.customProps={}] - Additional customProps.
 *
 * @example
 * const myError = new MyError({ message: 'Something went wrong', type: 'warning', customProps: { key: 'value' } });
 * throw myError;
 * 
 * or
 * 
 * const myError = new MyError('Something went wrong');
 * throw myError;
 *
 * @returns {MyError} An instance of MyError with the specified message, type, and customProps.
 */
export default class MyError extends Error {
    constructor(props) {
        if (typeof props === 'string') {
            super(props);
            this.type = 'error';  // Default type for string-only constructor
            this.customProps = {};
        } else {
            super(props.message || '');  // Pass an empty string if props.message is undefined
            this.type = props.type || 'error';  // Default type if props.type is undefined
            this.customProps = props.customProps || {};
        }
    }
}