const express = require('express');
const wineController = require('../controllers/WineController');
const router = express.Router();

router.post('/create', (req, res) => wineController.createWine(req, res));
router.get('/id/:wineId', (req, res) => wineController.getWineById(req, res));
router.get('/all', (req, res) => wineController.getAllWines(req, res));
router.delete('/delete/:wineId', (req, res) => wineController.deleteWine(req, res));
router.put('/update/:wineId', (req, res) => wineController.updateWine(req, res));
router.get('/name/:wineName', (req, res) => wineController.getWineByName(req, res));
router.get('/search/:query', (req, res) => {
    const { query } = req.params;
    console.log('Received query:', query);
    wineController.searchWinesByName(req, res);
  });

module.exports = router;
