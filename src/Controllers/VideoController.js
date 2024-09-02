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

    // console.log(req.file, videoPath)
    console.log()

    await prisma.$transaction(async (prisma) => {
        let Frame;
        try {
            await fs.writeFileSync(videoPath, req.file.buffer);

            Frame = await createThumbnail(videoPath);

            await prisma.user.update({
                where: {
                    id: req.user.id
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
            console.log(error);
            deleteVideoFrom(VideoName, Frame.savedFramePath);
            return next(new AppError("Failed to save video to disk", 500));
        }

    });

    res.json({
        message: "File uploaded!",
        Video: req.file.originalname,
    });
});


// stream video 
const streamVideo = catchAsync(async (req, res, next) => {
    const videoId = req.params.id; // Assuming videoId is passed as a URL parameter

    const video = await prisma.video.findUnique({
        where: {
            id: videoId
        }
    });

    // Increment view count
    await prisma.video.update({
        where: { id: videoId },
        data: { views: { increment: 1 } } // Assuming 'views' is the field for view count
    });

    // read file 
    const videoPath = path.join(__dirname, '..', 'Public', 'Videos', video.videoPath);
    console.log(videoPath, video);
    if (!fs.existsSync(videoPath) || !video) {
        return next(new AppError("video not found", 404))
    }

    const videoStat = await fs.promises.stat(videoPath); // video information
    // set headers
    const fileSize = videoStat.size;
    const range = req.headers.range;

    const parts = range ? range.replace(/bytes=/, "").split("-") : [];
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (range && start >= fileSize) {
        return next(new AppError("Ranges are not Valid", 400))
    }

    const chunksize = range ? end - start + 1 : fileSize;
    const head = {
        "Content-Range": range ? `bytes ${start}-${end}/${fileSize}` : undefined,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
    };

    res.writeHead(range ? 206 : 200, head);
    const file = fs.createReadStream(videoPath, range ? { start, end } : undefined);
    file.pipe(res);
})

const getAllVideos = catchAsync(async (req, res, next) => {
    const user = await prisma.video.findMany({
        // where: { id: req.user.id },
        select: { id: true, thumbnail: true, originalName: true, duration: true }
    });

    if (!user) {
        return next(new AppError("User Not found", 404));
    }

    console.log(user);

    const images = await Promise.all(
        user.map(async (video) => {
            const filePath = path.join(__dirname, '..', 'Public', 'Frames', video.thumbnail);
            const fileData = await fs.promises.readFile(filePath);
            const fileExt = path.extname(video.thumbnail).slice(1);
            return {
                id: video.id,
                name: video.originalName,
                duration: video.duration,
                data: `data:image/${fileExt};base64,${fileData.toString('base64')}`,
            };
        })
    );

    console.log(images);
    res.status(200).json({
        status: 'success',
        data: {
            videos: images
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
    const deletedVideo = await prisma.video.delete({
        where: {
            id: req.params.id
        }
    });

    console.log(deletedVideo);
    
    deleteVideoFrom(deletedVideo.videoPath, deletedVideo.thumbnail, next);
    // Send response
    res.status(204).json({
        status: 'success',
        video : deleteVideo.originalName
    });
});

module.exports = {
    getAllVideos,
    getVideoById,
    deleteVideo,
    uploadVideo,
    streamVideo
};
