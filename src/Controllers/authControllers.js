const prisma = require('../Config/PrismaClient');
const hashUser = require('../utils/hashPassword');
const { ComparePassword } = require('../utils/verifyPassword');
const { GenerateToken } = require('../utils/GenerateToken');
const { signUpSchema, loginSchema, emailschema } = require('../validate/validateUser');
const catchAsync = require('express-async-handler');
const AppErorr = require('../utils/appError');
const OTP = require('../utils/OTP');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const Login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // const { error } = loginSchema.validate({
    //     email, password
    // })

    // // required
    // if (error) {
    //     return next(new AppErorr("Email and Password are required", 400));
    // }
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

    const Userid = user.id;

    // send otp
    const secret = OTP.generateSecret();

    const otp = OTP.generateOTP(secret);

    const sendEmail = new Email(user, "http://localhost:3000/api/v1/users/verifyEmail")

    sendEmail.sendOTP("Verify Email", otp);

    const token = await GenerateToken(Userid, res);

    res.json({ message: "user signed up successfuly", token });
});


const verifyEmail = catchAsync(async (req, res, next) => {
    const { otp } = req.body;

    // get otp secrt.
    const secret = req.user.optSecret;

    // Validate OTP
    const verify = OTP.verifyOTP(otp, secret);
    console.log(secret);
    console.log(verify);
    if (!verify) {
        // Send OTP again
        const newSecret = OTP.generateSecret();
        console.log(req.user);
        await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                optSecret: newSecret
            }
        });
        const otp = OTP.generateOTP(newSecret);
        const sendEmail = new Email(req.user, "http://localhost:3000/api/users/verifyEmail")
        sendEmail.sendOTP("Verify Email", otp);
        // Throw error
        return next(new AppError("Wrong OTP, OTP sent again", 400));
    }

    // Update user's email verification status
    await prisma.user.update({
        where: {
            id: req.user.id
        },
        data: {
            emailVerified: true,
            optSecret: "verifed"
        }
    });

    res.status(200).json({ message: "Email verified successfully" });
});
module.exports = { Login, SignUp, verifyEmail };