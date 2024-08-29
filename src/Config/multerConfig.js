const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /mp4|mkv|mov|avi/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype); // search for it

  // console.log(1);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Videos Only!");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // 100MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("Video");

module.exports = upload;
