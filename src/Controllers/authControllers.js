
const prisma = require('../Config/PrismaClient');
const hashUser = require('../utils/hashPassword');
const { ComparePassword } = require('../utils/verifyPassword');
const { GenerateToken } = require('../utils/GenerateToken');
const { signUpSchema, loginSchema, emailschema } = require('../validate/validateUser');


const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = loginSchema.validate({
            email, password
        })

        if (error) {
            return res.json({
                error
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
        });

        const valid_password = await ComparePassword(password, user.password);

        if (!valid_password || !user) {
            return res.json({
                message: "Wrong password or Email"
            })
        }


        const payload = {
            id: user.id,
        };

        const token = await GenerateToken(payload, res);

        res.json({ message: "Login success", token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const SignUp = async (req, res) => {
    try {
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
        ;
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = { Login, SignUp };