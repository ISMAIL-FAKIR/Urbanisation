const express = require('express');
const router = express.Router();
const noteController = require('../controllers/NoteController');

router.post('/create', noteController.createOrUpdateNote);
router.get('/:wineId', noteController.getAllNotesForWine);
router.get('/user/:userId/wine/:wineId', noteController.getNoteFromUserForWine);
module.exports = router;
