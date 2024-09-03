const prisma = require('../Config/PrismaClient');
const catchAsync = require('express-async-handler');
const AppError = require('../utils/appError');

// Function to get all comments
const getAllComments = catchAsync(async (req, res, next) => {
    const videoId = req.params.videoId;
    const findVideo = await prisma.video.findUnique({
        where: {
            id: videoId
        }
    }
    )
    if (!findVideo) {
        return next(new AppError("video dosn't exist", 404))
    }
    const comments = await prisma.comment.findMany({
        where: {
            videoId: videoId
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    res.status(200).json({ message: "Comments fetched successfully", comments });
});

// Function to get a comment by its ID
const getCommentById = catchAsync(async (req, res, next) => {
    const id = req.params.videoId;
    const comment = await prisma.comment.findUnique({
        where: {
            id,
        },
    });

    if (!comment) {
        return next(new AppError('No comment found with that ID', 404));
    }

    res.status(200).json({
        message: "success",
        comment
    });
});

// Function to add a new comment
const addComment = catchAsync(async (req, res, next) => {
    const { content } = req.body;
    const videoId = req.params.videoId;
    const { id } = req.user; // Assuming the user's ID is available in the request
    // find video
    const findVideo = await prisma.video.findUnique({
        where: {
            id: videoId
        }
    }
    )

    // throw error
    if (!findVideo) {
        return next(new AppError("video dosn't exist", 404))
    }
    
    const newComment = await prisma.comment.create({
        data: {
            content,
            userId: id,
            videoId,
        },
        select: {
            id: true,
            content: true,
            userId: true,
            videoId: true,
        },
    });
    res.status(201).json({
        message: "Comment added successfully",
        newComment
    });
});

// Function to edit a comment
const editComment = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;


    const comment = await prisma.comment.update({
        where: {
            id,
        },
        data: {
            content,
        },
    });
    if (!comment) {
        return next(new AppError('No comment found with that ID', 404));
    }
    res.status(200).json({
        message: "success",
        comment
    });
});


// Function to delete a comment
const deleteComment = catchAsync(async (req, res) => {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({
        where: {
            id,
        },
    });
    if (!comment) {
        return next(new AppError('No comment found with that ID', 404));
    }
    await prisma.comment.delete({
        where: {
            id,
        },
    });
    res.status(204).send({
        message: "comment deleted successfully"
    });
});

module.exports = {
    getAllComments,
    getCommentById,
    addComment,
    editComment,
    deleteComment,
};
