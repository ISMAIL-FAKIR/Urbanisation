const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');


router.post('/create', commentController.createComment);
router.put('/update/:commentId/forWine/:wineId', commentController.updateComment);
router.get('/get/:wineId/comments', commentController.getAllCommentsForWine);
router.delete('/delete/:commentId', commentController.deleteComment);
router.get('/user/:userId/wine/:wineId', commentController.getCommentFromUserForWine);

module.exports = router;
