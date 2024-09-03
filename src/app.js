const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const userRoutes = require('./Routs/UserRout');
const videoRoutes = require('./Routs/VideoRout');
const commentRoutes = require('./Routs/commentRout');

// variables
const app = express();


app.use(express.static("Public"));
app.use(bodyParser.json())
app.use(cookieParser())

// routes
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments' , commentRoutes)

module.exports = app;