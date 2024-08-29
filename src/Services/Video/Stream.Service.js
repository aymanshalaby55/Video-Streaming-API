const fs = require('fs');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const streamVideo = catchAsync(async (req, res, next) => {
    const range = req.headers.range;
    if (!range) {
        return next(new AppError('Range header required', 400));
    }

    const videoPath = video.filePath;
    const videoSize = video.fileSize;

    const [start, end] = range.replace(/bytes=/, "").split("-").map(Number);
    const chunkEnd = end ? end : Math.min(start + 1e6, videoSize - 1);

    res.writeHead(206, {
        "Content-Range": `bytes ${start}-${chunkEnd}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkEnd - start + 1,
        "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath, { start, end: chunkEnd }).pipe(res);
});

module.exports = { streamVideo };
