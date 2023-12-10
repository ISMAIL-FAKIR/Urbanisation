const { get } = require('../routes/noteRoutes');
const db = require('../utils/db');

class CommentModel {
  createComment(description, userId, wineId) {
    const insertCommentQuery = 'INSERT INTO commentaire (description, id_personne, id_winebottle) VALUES (?, ?, ?)';
    const values = [description, userId, wineId];

    return new Promise((resolve, reject) => {
      db.query(insertCommentQuery, values, (error, result) => {
        if (error) {
          console.error('Error creating comment:', error);
          reject({ error: 'Error creating comment' });
        } else {
          const insertedComment = {
            id: result.insertId,
            description,
            id_personne: userId,
            id_winebottle: wineId,
          };

          console.log('Comment created successfully.');
          resolve(insertedComment);
        }
      });
    });
  }


updateComment(commentId, userId, description,wineId) {
    const updateCommentQuery = 'UPDATE commentaire SET description = ? WHERE id = ? AND id_personne = ? AND id_winebottle = ?';
    const values = [description, commentId, userId, wineId];
  
    return new Promise((resolve, reject) => {
      db.query(updateCommentQuery, values, (error) => {
        if (error) {
          console.error('Error updating comment:', error);
          reject({ error: 'Error updating comment' });
        } else {
          console.log('Comment updated successfully.');
          resolve({ message: 'Comment updated successfully.' });
        }
      });
    });
  }
  

  getAllCommentsForWine(wineId) {
    const getAllCommentsQuery = 'SELECT * FROM commentaire WHERE id_winebottle = ?';
    return new Promise((resolve, reject) => {
      db.query(getAllCommentsQuery, [wineId], (error, results) => {
        if (error) {
          console.error('Error fetching all comments for wine:', error);
          reject({ error: 'Error fetching all comments for wine' });
        } else {
          console.log('All comments fetched successfully.');
          resolve(results);
        }
      });
    });
  }


  deleteCommentForUserOnWine(commentId, userId, wineId) {
    const deleteCommentQuery = 'DELETE FROM commentaire WHERE id = ? AND id_personne = ? AND id_winebottle = ?';
    return new Promise((resolve, reject) => {
      db.query(deleteCommentQuery, [commentId, userId, wineId], (error, results) => {
        if (error) {
          console.error('Error deleting comment:', error);
          reject({ error: 'Error deleting comment' });
        } else {
          console.log('Comment deleted successfully.');
          resolve(results);
        }
      });
    });
  }


  getCommentFromUserForWine(userId, wineId) {
    const getCommentQuery = 'SELECT * FROM commentaire WHERE id_personne = ? AND id_winebottle = ?';
    return new Promise((resolve, reject) => {
      db.query(getCommentQuery, [userId, wineId], (error, results) => {
        if (error) {
          console.error('Error fetching comment:', error);
          reject({ error: 'Error fetching comment' });
        } else {
          console.log('Comment fetched successfully.');
          resolve(results[0]);
        }
      });
    });
  }

}


module.exports = new CommentModel();
