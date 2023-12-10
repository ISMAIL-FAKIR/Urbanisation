const OCRModel = require('../models/OCRModel'); // Import the OCRModel

class OCRController {
  async processImage(req, res) {
  try {
    const { buffer } = req.file; // Accéder au fichier depuis le middleware multer
    const result = await OCRModel.processImage(buffer);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
}

module.exports = new OCRController();
