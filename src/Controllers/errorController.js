const {
    SendErrorDev,
} = require('../Services/error/divError.Service');


const { 
    handleCastErrorDB,
    handleDublicateErrorDB,
    handleValidationErrDB,
    handJWTError,
    handJWTExpireDate,
    SendErrorProd,
    handleNotFound } = require('../Services/error/prodError.Service');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // dev error
    if (process.env.NODE_ENV === 'development') {
        SendErrorDev(err, req, res);
    } 
    // prod error
    else if (process.env.NODE_ENV === 'production') {
        let error = err;

        switch (error.name) {
            case 'CastError':
                error = handleCastErrorDB(error);
                break;
            case 'JsonWebTokenError':
                error = handJWTError(error);
                break;
            case 'TokenExpiredError':
                error = handJWTExpireDate(error);
                break;
        }
        // not found
        if(error.code === "P2025"){
            error = handleNotFound(error);
        }
        
        // dublicate value
        if (error.code === 11000) {
            error = handleDublicateErrorDB(error);
        }

        if (error.name === 'validatonError') {
            error = handleValidationErrDB(error);
        }

        SendErrorProd(error, req, res);
    }
};