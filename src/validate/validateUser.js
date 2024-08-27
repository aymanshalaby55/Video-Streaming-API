const Joi = require('joi');

const signUpSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});


const emailschema = Joi.object({
    email: Joi.string().email().required(),
})


module.exports = {
    signUpSchema,
    loginSchema, 
    emailschema
};