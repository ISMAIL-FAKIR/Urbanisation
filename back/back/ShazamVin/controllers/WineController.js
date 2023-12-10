const e = require('express');
const wineModel = require('../models/WineModel');

class WineController {
  async createWine(req, res) {
    try {
      const { nom, description, embouteillage, cepage, chateau, prix, photoBlob } = req.body;
      const insertedWine = await wineModel.createWineWithPhoto(nom, description, embouteillage, cepage, chateau, prix, photoBlob);
      res.status(200).json({ message: 'Wine created successfully.', wine: insertedWine });
    } catch (error) {
      console.error('Error creating wine:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

  getWineById(req, res) {
    const { wineId } = req.params;
    wineModel.getWineById(wineId)
      .then((wine) => res.status(200).json({ message: 'Wine retrieved successfully.', wine }))
      .catch((error) => res.status(404).json(error));
  }

  getAllWines(req, res) {
    wineModel.getAllWines()
      .then((wines) => res.status(200).json(wines))
      .catch((error) => res.status(500).json(error));
  }

  deleteWine(req, res) {
    const { wineId } = req.params;
    wineModel.deleteWine(wineId)
      .then((message) => res.status(200).json(message))
      .catch((error) => res.status(500).json(error));
  }

  updateWine(req, res) {
    const { wineId } = req.params;
    const { nom, description, embouteillage, cepage, chateau, prix } = req.body;
    wineModel.updateWine(wineId, nom, description, embouteillage, cepage, chateau, prix)
      .then((message) => res.status(200).json(message))
      .catch((error) => res.status(500).json(error));
  }

  getWineByName(req, res) {
    const { wineName } = req.params;
    wineModel.getWineByName(wineName)
      .then((wine) => res.status(200).json({ message: 'Wine retrieved successfully.', wine }))
      .catch((error) => res.status(404).json({ error: 'Wine not found', details: error }));
  }

// for searchWinesByName in react in real time
  searchWinesByName(req, res) {
    const { query } = req.params;
    wineModel.searchWinesByName(query)
      .then((wines) => res.status(200).json({ message: 'Wines retrieved successfully.', wines }))
      .catch((error) => res.status(500).json(error));
  }
}

module.exports = new WineController();
