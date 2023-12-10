const express = require('express');
const router = express.Router();
const multer = require('multer');
const ocrController = require('../controllers/OCRController');

// Configuration de multer pour stocker les fichiers dans le dossier 'uploads'
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint pour traiter les images
router.post('/process-image', upload.single('image'), ocrController.processImage);

module.exports = router;
