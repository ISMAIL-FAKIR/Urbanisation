const noteModel = require('../models/NoteModel');

class NoteController {

  createOrUpdateNote(req, res) {
    const { valeur, userId, wineId } = req.body;  

    noteModel.getNoteByUserAndWine(userId, wineId)
      .then((existingNote) => {
        if (existingNote) {
          return noteModel.updateNote(existingNote.id, valeur);
        } else {
          return noteModel.createNote(valeur, userId, wineId);
        }
      })
      .then(() => res.status(200).json({ message: 'Note created/updated successfully.' }))
      .catch((error) => res.status(500).json(error));
  }

  
  getAllNotesForWine(req, res) {
    const { wineId } = req.params;

    noteModel.getAllNotesForWine(wineId)
      .then((notes) => {
        if (notes.length === 0) {
          res.status(404).json({ error: 'No notes found for the wine.' });
        } else {
          const totalNotes = notes.length;
          const totalValue = notes.reduce((sum, note) => sum + note.valeur, 0);
          const averageValue = totalValue / totalNotes;

          res.status(200).json({
            message: 'All notes fetched successfully.',
            notes,
            averageValue,
          });
        }
      })
      .catch((error) => res.status(500).json({ error: 'Internal Server Error', details: error }));
  }
  

  getNoteFromUserForWine(req, res) {
    const { userId, wineId } = req.params;  

    noteModel.getNoteFromUserForWine(userId, wineId)
      .then((note) => res.status(200).json({ message: 'Note fetched successfully.', note }))
      .catch((error) => res.status(500).json(error));
  }

}

module.exports = new NoteController();
