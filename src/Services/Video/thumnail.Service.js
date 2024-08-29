const fs = require('fs').promises;
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ffprobeStatic = require('ffprobe-static');

ffmpeg.setFfmpegPath(ffmpegPath);

const outputFolder = path.join(__dirname, '..', '..', 'Public', 'Frames');

const getVideoDuration = (videoPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, { path: ffprobeStatic.path }, (err, metadata) => {
            if (err) {
                console.error('Error getting video duration:', err);
                reject(err);
            } else {
                resolve(metadata.format.duration);
            }
        });
    });
};

const createThumbnail = async (videoPath) => {
    await fs.mkdir(outputFolder, { recursive: true });

    // console.log(videoPath);

    const videoDuration = await getVideoDuration(videoPath);

    // console.log(`Video duration: ${videoDuration} seconds`);

    const savedFramePath = `image-${Date.now()}.jpg`;
    const outputPath = path.join(outputFolder, savedFramePath);

    return new Promise((resolve, reject) => {
        const randomDuration = Math.floor(Math.random() * videoDuration);
        ffmpeg(videoPath)
            .seekInput(randomDuration) // Use seekInput for -ss
            .outputOptions(['-vframes', '1']) // Keep -vframes as an output option
            .output(outputPath)
            .on('end', () => {
                console.log(`Finished extracting frame at ${randomDuration} seconds`);
                resolve({ savedFramePath, videoDuration });
            })
            .on('error', (err) => {
                console.error('Error extracting frame:', err);
                reject(err);
            })
            .run();
    });

};

module.exports = { createThumbnail };