const db = require('../utils/db');

class NoteModel {

  async createOrUpdateNote(valeur, userId, wineId) {
    // Check if a note already exists for the user and wine
    const existingNote = await this.getNoteByUserAndWine(userId, wineId);

    if (existingNote) {
      // If a note exists, update the existing note
      return this.updateNote(existingNote.id, valeur);
    } else {
      return this.createNote(valeur, userId, wineId);
    }
  }

  async getNoteByUserAndWine(userId, wineId) {
    const getNoteQuery = 'SELECT * FROM note WHERE id_personne = ? AND id_wine = ?';
    const values = [userId, wineId];

    return new Promise((resolve, reject) => {
      db.query(getNoteQuery, values, (error, results) => {
        if (error) {
          console.error('Error fetching note:', error);
          reject({ error: 'Error fetching note' });
        } else {
          if (results.length > 0) {
            resolve(results[0]);
          } else {
            resolve(null); 
          }
        }
      });
    });
  }

  createNote(valeur, userId, wineId) {
    const insertNoteQuery = 'INSERT INTO note (valeur, id_personne, id_wine) VALUES (?, ?, ?)';
    const values = [valeur, userId, wineId];

    return new Promise((resolve, reject) => {
      db.query(insertNoteQuery, values, (error, result) => {
        if (error) {
          console.error('Error creating note:', error);
          reject({ error: 'Error creating note' });
        } else {
          const insertedNote = {
            id: result.insertId,
            valeur,
            id_personne: userId,
            id_wine: wineId,
          };

          console.log('Note created successfully.');
          resolve(insertedNote);
        }
      });
    });
  }

  updateNote(noteId, valeur) {
    const updateNoteQuery = 'UPDATE note SET valeur = ? WHERE id = ?';
    const values = [valeur, noteId];

    return new Promise((resolve, reject) => {
      db.query(updateNoteQuery, values, (error) => {
        if (error) {
          console.error('Error updating note:', error);
          reject({ error: 'Error updating note' });
        } else {
          console.log('Note updated successfully.');
          resolve({ message: 'Note updated successfully.' });
        }
      });
    });
  }


  getAllNotesForWine(wineId) {
    const getAllNotesQuery = 'SELECT valeur FROM note WHERE id_wine = ?';
    return new Promise((resolve, reject) => {
      db.query(getAllNotesQuery, [wineId], (error, results) => {
        if (error) {
          console.error('Error fetching all notes for wine:', error);
          reject({ error: 'Error fetching all notes for wine' });
        } else {
          console.log('All notes fetched successfully.');
          resolve(results);
        }
      });
    });
  }

  getNoteFromUserForWine(userId, wineId) {
    const getNoteQuery = 'SELECT valeur FROM note WHERE id_personne = ? AND id_wine = ?';

    return new Promise((resolve, reject) => {
      db.query(getNoteQuery, [userId, wineId], (error, results) => {
        if (error) {
          console.error('Error fetching note for user and wine:', error);
          reject({ error: 'Error fetching note for user and wine' });
        } else {
          if (results.length > 0) {
            console.log('Note fetched successfully.');
            resolve({ valeur: results[0].valeur });
          } else {
            console.log('No note found for the user and wine.');
            resolve({ valeur: null }); 
          }
        }
      });
    });
  }

}

module.exports = new NoteModel();
