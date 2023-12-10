
const commentModel = require('../models/CommentModel');

class CommentController {
  createComment(req, res) {
    const { description, userId, wineId } = req.body;

    commentModel.createComment(description, userId, wineId)
      .then((insertedComment) => res.status(200).json(insertedComment))
      .catch((error) => res.status(500).json(error));
  }

updateComment(req, res) {
    const { commentId } = req.params;
    const { userId } = req.body; 
    const { description } = req.body;
    const { wineId } = req.params; 
  
    commentModel.updateComment(commentId, userId, description, wineId)
      .then(() => res.status(200).json({ message: 'Comment updated successfully.' }))
      .catch((error) => res.status(500).json(error));
  }
  

  getAllCommentsForWine(req, res) {
    const { wineId } = req.params;

    commentModel.getAllCommentsForWine(wineId)
      .then((comments) => res.status(200).json({ message: 'All comments fetched successfully.', comments }))
      .catch((error) => res.status(500).json(error));
  }

  deleteComment(req, res) {
    const { commentId } = req.params;
    const { userId, wineId } = req.body;

    commentModel.deleteCommentForUserOnWine(commentId, userId, wineId)
      .then(() => {
        res.status(200).json({ message: 'Comment deleted successfully.' });
      })
      .catch((error) => res.status(500).json({ error: 'Internal Server Error', details: error }));
  }


  getCommentFromUserForWine(req, res) {
    const { userId, wineId } = req.params;  

    commentModel.getCommentFromUserForWine(userId, wineId)
      .then((comment) => res.status(200).json({ message: 'Comment fetched successfully.', comment }))
      .catch((error) => res.status(500).json(error));
  }

}

module.exports = new CommentController();
