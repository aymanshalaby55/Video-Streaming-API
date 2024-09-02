const express = require('express');
const router = express.Router();

// Video controller functions (assuming they are defined in a separate file)
const { getAllVideos, getVideoById, uploadVideo, deleteVideo, streamVideo } = require('../Controllers/VideoController.js');
const { Protect, verifyEmailMiddllware } = require('../Middleware/AuthUser.js');
const { addVideoToFavorite, deleteVideoFromFavorite } = require('../Controllers/favoriteVideo.Controller.js');
const upload = require('../Config/multerConfig');

// Define routes for video operations
router.use(Protect);
// router.use(verifyEmailMiddllware);

// Video routes
router.post('/uploadVideo', upload, uploadVideo);
router.get('/getAllVideos', getAllVideos);
router.get('/getVideobyId/:id', getVideoById);
router.delete('/deleteVideo/:id', deleteVideo);
router.get('/streamVideo/:id', streamVideo);

// Favorite video routes
router.post('/addVideoToFavorite', addVideoToFavorite);
router.delete('/deleteVideoFromFavorite', deleteVideoFromFavorite);

module.exports = router;
