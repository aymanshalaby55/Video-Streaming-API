const prisma = require('../Config/PrismaClient');
const hashUser = require('../utils/hashPassword');
const { ComparePassword } = require('../utils/verifyPassword');
const { GenerateToken } = require('../utils/GenerateToken');
const { signUpSchema, loginSchema, emailschema } = require('../validate/validateUser');
const catchAsync = require('express-async-handler');
const AppErorr = require('../utils/appError');

const Login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const { error } = loginSchema.validate({
        email, password
    })

    // required
    if (error) {
        return next(new AppErorr("Email and Password are required", 400));
    }
    // find user
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            id: true,
            password: true,
        }
    });

    // verify email and password
    if (!user) {
        return next(new AppErorr("invalid password or Email"))
    }

    // check password
    const valid_password = await ComparePassword(password, user.password);

    // invalid Password
    if (!valid_password) {
        return next(new app("invalid password or Email"))
    }

    // create token
    const userId = user.id;

    const token = await GenerateToken(userId, res);

    res.json({ message: "Login success", token });
});

const SignUp = catchAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const { error } = signUpSchema.validate(req.body);
    if (error) {
        return res.json({
            error
        })
    }
    const checkEmail = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (checkEmail) {
        return res.json({ status: "this Email already exist" });
    }

    const hashedPassword = await hashUser(password);
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    });
    const payload = {
        id: user.id,
    };
    const token = await GenerateToken(payload, res);

    res.json({ message: "user signed up successfuly" });
});

module.exports = { Login, SignUp };