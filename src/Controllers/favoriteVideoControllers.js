const prisma = require('../Config/PrismaClient');
const catchAsync = require('express-async-handler');
const AppError = require('../utils/appError');

// Add video to favorite list
const addVideoToFavorite = catchAsync(async (req, res, next) => {
    const { videoId } = req.body;
    const userId = req.user.id;

    const favoriteVideo = await prisma.favoriteVideos.create({
        data: {
            userId,
            videoId
        }
    });

    res.status(201).json({
        status: 'success',
        data: {
            favoriteVideo
        }
    });
});

// Delete video from favorite list
const deleteVideoFromFavorite = catchAsync(async (req, res, next) => {
    const { videoId } = req.body;
    const userId = req.user.id;

    const favoriteVideo = await prisma.favoriteVideos.delete({
        where: {
            userId_videoId: {
                userId,
                videoId
            }
        }
    });

    if (!favoriteVideo) {
        return next(new AppError('Video not found in favorite list', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

module.exports = {
    addVideoToFavorite,
    deleteVideoFromFavorite
};
