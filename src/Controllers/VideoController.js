const prisma = require('../Config/PrismaClient');
const upload = require('../Config/multerConfig');
const { videoSchema } = require('../validate/validateVideo');
const fs = require('fs');
const path = require('path')

uploadVideo = async (req, res, next) => {
    const user = req.user;
    upload(req, res, async (err) => {
        if (!req.file) {
            return res.status(400).json({ message: "No video uploaded" });
        }

        const videoPath = path.join(__dirname, '..', 'Public', 'Videos', `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`);
        console.log(req.file , videoPath)
        try {
            fs.writeFileSync(videoPath, req.file.buffer);
        } catch (error) {
            fs.unlink(videoPath, (err) => {
                if (err) {
                    console.error("Failed to delete the file:", err);
                }
            });
            return res.status(500).json({ message: "Failed to save video to disk", error: error });
        }

        
        const newVideo = await prisma.video.create({
            data: {
                ...req.body,
                videoPath,
                isPublic : Boolean(true),
                fileSize: req.file.size,
                originalName: req.file.originalname
            },
        });

        res.send({
            message: "File uploaded!",
             newVideo,
        });
    });
};

const getAllVideos = async (req, res) => {
    try {
        const videos = await prisma.video.findMany();
        res.status(200).json({
            status: 'success',
            results: videos.length,
            data: {
                videos
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get video by ID
const getVideoById = async (req, res) => {
    try {
        const video = await prisma.video.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!video) {
            return res.status(404).json({
                status: 'fail',
                message: 'Video not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                video
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Create a new video
const createVideo = async (req, res) => {
    try {
        const newVideo = await prisma.video.create({
            data: req.body
        });
        res.status(201).json({
            status: 'success',
            data: {
                video: newVideo
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Delete video by ID
const deleteVideo = async (req, res) => {
    try {
        const video = await prisma.video.delete({
            where: {
                id: req.params.id
            }
        });
        if (!video) {
            return res.status(404).json({
                status: 'fail',
                message: 'Video not found'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

module.exports = {
    getAllVideos,
    getVideoById,
    createVideo,
    deleteVideo,
    uploadVideo
};
