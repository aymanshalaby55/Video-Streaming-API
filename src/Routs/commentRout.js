const express = require('express');
const router = express.Router({ mergeParams: true });

// Comment controller functions (assuming they are defined in a separate file)
const { getAllComments, getCommentById, addComment, editComment, deleteComment } = require('../Controllers/commentControllers.js');
const { Protect, verifyEmailMiddllware } = require('../Middleware/AuthUser.js');

// Define routes for comment operations
router.use(Protect);
router.use(verifyEmailMiddllware);

// Comment routes
router.get('/getAllComments', getAllComments);
router.get('/getCommentById/:id', getCommentById);
router.post('/addComment', addComment);
router.put('/editComment/:id', editComment);
router.delete('/deleteComment/:id', deleteComment);

module.exports = router;
