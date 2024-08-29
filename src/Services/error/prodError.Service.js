const AppError = require('../../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDublicateErrorDB = (err) => {
  const value = err.errmsg.match(/"(.*?)"/g);
  const message = `Dublicate field values: ${value} , please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrDB = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handJWTError = () =>
  new AppError('Invalid token, please Log in again!', 401);

const handJWTExpireDate = () =>
  new AppError('Token Expired, please Log in again', 401);

const handleNotFound = (error) => {
  console.log(error);
  const message = error.meta.cause.replace("Record", error.meta.modelName);
  return new AppError(message, 404);
}


const SendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.error('ERROR 💥', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });

};

module.exports = {
  handleCastErrorDB,
  handleDublicateErrorDB,
  handleValidationErrDB,
  handJWTError,
  handJWTExpireDate,
  SendErrorProd,
  handleNotFound
};

// middleware error function
