const jwt = require('jsonwebtoken');
const prisma = require('../Config/PrismaClient');
const catchAsync = require('express-async-handler');
const AppError = require('../utils/appError');

const Protect = catchAsync(async (req, res, next) => {
    const authorization = req.headers.authorization;

    // get token from request or cookie
    let token;
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // handle not found token
    if (!token) {
        return next(new AppError("You are not authorized to access this resource", 401));
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.Userid } });
    if (!user) {
        return next(new AppError("User not found", 404))
    }
    req.user = user;
    next();
});


const authorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            next(
                new AppError('You do not have the permission to do this action', 403)
            );
        }
        next();
    };
};

const verifyEmailMiddllware = (req, res, next) => {
    if (!req.user.emailVerified) {
        next(
            new AppError('You do not have the permission to do this action', 403)
        );
    }
    next();
};

module.exports = { Protect, authorized, verifyEmailMiddllware };