const jwt = require('jsonwebtoken');
const CatchAsync = require('express-async-handler');

const GenerateToken = CatchAsync(async (payload, res) => {

    console.log(payload)
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });

    const cookieOptions = {
        expires: new Date(
            Date.now() +  24 * 60 * 60 * 1000 // convert it to milleseconds
        ),
        httpOnly: true // can't manipluate cookie in any way in the browser.
    };

    res.cookie('token', token, cookieOptions);

    // set authorization headers
    res.setHeader('Authorization', `Bearer ${token}`);

    return { token };
});

module.exports = { GenerateToken };
