class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // operation error

        // Captures the stack trace and attaches it to the error object
        // This helps in debugging by providing the point in the code where the error was instantiated
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;