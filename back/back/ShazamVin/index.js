const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const personneRoutes = require('./routes/personneRoutes');
const wineRoutes = require('./routes/wineRoutes');
const ocrRoutes = require('./routes/ocrRoutes');
const noteRoutes = require('./routes/noteRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(cors()); // Ajoutez cette ligne pour activer CORS pour toutes les routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Vos routes ici...
app.use('/personne', personneRoutes);
app.use('/wine', wineRoutes);
app.use('/ocr', ocrRoutes);
app.use('/notes', noteRoutes);
app.use('/comments', commentRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
