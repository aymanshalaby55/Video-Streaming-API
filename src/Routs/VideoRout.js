const express = require('express');
const router = express.Router();

// Video controller functions (assuming they are defined in a separate file)
const { getAllVideos, getVideoById, createVideo, uploadVideo, deleteVideo } = require('../Controllers/VideoController.js');
// Define routes for video operations
router.post('/uploadVideo', uploadVideo)
router.get('/getAllVideos', getAllVideos);
router.get('/getVideobyId/:id', getVideoById);
router.post('/uploadVideo', createVideo);
router.delete('/deleteVideo', deleteVideo);

module.exports = router;
