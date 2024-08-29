const prisma = require('../Config/PrismaClient');
const { deleteVideoFrom } = require('../Services/Video/delete.service')
const { videoSchema } = require('../validate/validateVideo');
const fs = require('fs');
const path = require('path');
const catchAsync = require('express-async-handler');
const AppError = require('../utils/appError');
const { createThumbnail } = require('../Services/Video/thumnail.Service');

const uploadVideo = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError("No file uploaded", 400));
    }

    const VideoName = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`

    const videoPath = path.join(__dirname, '..', 'Public', 'Videos', VideoName);

    console.log(req.file, videoPath)

    await prisma.$transaction(async (prisma) => {
        let Frame;
        try {
            await fs.writeFileSync(videoPath, req.file.buffer);

            Frame = await createThumbnail(videoPath);

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    videos: {
                        create: {
                            ...req.body,
                            videoPath: VideoName,
                            thumbnail: Frame.savedFramePath,
                            duration: Frame.videoDuration,
                            originalName: req.file.originalname,
                            fileSize: req.file.size,
                            isPublic: true
                        },
                    }
                }
            });
        } catch (error) {
            deleteVideoFrom(VideoName, Frame.savedFramePath);
            return next(new AppError("Failed to save video to disk", 500));
        }

    });

    res.json({
        message: "File uploaded!",
        Video: req.file.originalname,
    });
});

const getAllVideos = catchAsync(async (req, res, next) => {
    const videos = await prisma.video.findMany({
        where: {
            isPublic: true
        }
    });
    res.status(200).json({
        status: 'success',
        results: videos.length,
        data: {
            videos
        }
    });
});

// Get video by ID
const getVideoById = catchAsync(async (req, res, next) => {
    const video = await prisma.$transaction(async (prisma) => {
        const video = await prisma.video.findUnique({
            where: {
                id: req.params.id
            }
        });

        if (!video) {
            return next(new AppError("Video Not Found", 404))
        }
        streamVideo(video.path);
    });
});

// Delete video by ID
const deleteVideo = catchAsync(async (req, res, next) => {
    // Delete the video with the id
    await prisma.$transaction(async (prisma) => {
        const deletedVideo = await prisma.video.delete({
            where: {
                id: req.params.id
            }
        });

        // delete Video and frame From public
        deleteVideoFrom(deletedVideo.videoPath, deletedVideo.savedFramePath, next);
    });

    // Send response
    res.status(204).json({
        status: 'success',
    });
});

module.exports = {
    getAllVideos,
    getVideoById,
    deleteVideo,
    uploadVideo
};
