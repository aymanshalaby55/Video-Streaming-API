const fs = require('fs');

const streamVideo = async (req, res) => {
    try {
        
        const range = req.headers.range;
        if (!range) {
            return res.status(400).send('Range header required');
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { streamVideo };
