const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet');

const userRoutes = require('./Routs/UserRout');
const videoRoutes = require('./Routs/VideoRout');
const commentRoutes = require('./Routs/commentRout');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./Config/api-document.json');

// variables
const app = express();

// set rate limiter to avoid dodds attacks
const limit = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many requests from this IP, please try again in an hour'
});

app.use(helmet()); // security headers
app.use(express.static("Public"));
app.use(bodyParser.json())
app.use(cookieParser())

// routes
app.use('/api', limit); // rate limiter
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = app;