const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const userRoutes = require('./Routs/UserRout');
const videoRoutes = require('./Routs/VideoRout');

// variables
const app = express();


app.use(express.static("Public"));
app.use(bodyParser.json())
app.use(cookieParser())

// routes
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

module.exports = app;