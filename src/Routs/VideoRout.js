const express = require('express');
const router = express.Router();

// Video controller functions (assuming they are defined in a separate file)
const { getAllVideos, getVideoById, uploadVideo, deleteVideo } = require('../Controllers/VideoController.js');
const { Protect } = require('../Middleware/AuthUser.js');
const upload = require('../Config/multerConfig');

// Define routes for video operations
router.post('/uploadVideo', Protect, upload, uploadVideo)
router.get('/getAllVideos', getAllVideos);
router.get('/getVideobyId/:id', getVideoById);
router.delete('/deleteVideo/:id', deleteVideo);

module.exports = router;
