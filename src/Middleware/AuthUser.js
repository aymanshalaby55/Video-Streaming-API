const jwt = require('jsonwebtoken');
const prisma = require('../Config/PrismaClient');
const { promisify } = require('util');


const Protect = async (req, res, next) => {
    const authorization = req.headers.authorization;

    // get token fron requset
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: "You are not authorized to access this resource" });
    }

    // console.log(token)
    // verify token.
    try {
        console.log(process.env.JWT_SECRET)
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await prisma.user.findUnique({ where: { id: decoded.payload.id } });
        console.log(user);
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: "Token is not valid" });
    }

}

module.exports = { Protect };