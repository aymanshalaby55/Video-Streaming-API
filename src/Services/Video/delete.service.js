const fs = require('fs');
const path = require('path');
const catchAsync = require('express-async-handler');
const AppError = require('../../utils/appError');

const deleteVideoFrom = catchAsync(async (videoName, frameName, next) => {
    // const path = require('path').join(__dirname, 'videos', videoPath);
    const video = path.join(__dirname, '../../Public/Videos', videoName);
    const frame = path.join(__dirname, '../../Public/Frames', frameName);
    // console.log(path)
    fs.unlink(video, (err) => {
        if (err) {
            console.error("Failed to delete the file:", err);
            return next(new AppError("Failed to delete the Video", 500));
        }
    });

    fs.unlink(frame, (err) => {
        if (err) {
            console.error("Failed to delete the file:", err);
            return next(new AppError("Failed to delete the Video", 500));
        }
    });
});

module.exports = { deleteVideoFrom }