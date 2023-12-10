const db = require('../utils/db');

class WineModel {
  createWineWithPhoto(nom, description, embouteillage, cepage, chateau, prix, photoBlob) {
    const insertWineQuery = 'INSERT INTO winebottle (nom, description, embouteillage, cepage, chateau, prix, photo_blob) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [nom, description, embouteillage, cepage, chateau, prix, photoBlob];

    return new Promise((resolve, reject) => {
      db.query(insertWineQuery, values, (error, result) => {
        if (error) {
          console.error('Error creating wine with photo blob:', error);
          reject({ error: 'Error creating wine with photo blob' });
        } else {
          // Resolve with the inserted wine details
          const insertedWine = {
            id: result.insertId,
            nom,
            description,
            embouteillage,
            cepage,
            chateau,
            prix,
            photo_blob: photoBlob,
          };

          console.log('Wine created with photo blob successfully.');
          resolve(insertedWine);
        }
      });
    });
  }

  getWineById(wineId) {
    const getWineQuery = 'SELECT * FROM winebottle WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(getWineQuery, [wineId], (error, results) => {
        if (error) {
          console.error('Error fetching wine:', error);
          reject({ error: 'Internal Server Error' });
        } else {
          if (results.length > 0) {
            console.log('Wine found:', results[0]);
            resolve(results[0]);
          } else {
            console.log('Wine not found.');
            reject({ error: 'Wine not found.' });
          }
        }
      });
    });
  }

  getAllWines() {
    const getAllWinesQuery = 'SELECT * FROM winebottle';
    return new Promise((resolve, reject) => {
      console.log('Fetching all wines...')
      db.query(getAllWinesQuery, (error, results) => {
        if (error) {
          console.error('Error fetching all wines:', error);
          reject({ error: 'Error fetching all wines' });
        } else {
          console.log('All wines fetched successfully.');
          resolve(results);
        }
      });
    });
  }

  deleteWine(wineId) {
    const deleteWineQuery = 'DELETE FROM winebottle WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.query(deleteWineQuery, [wineId], (error) => {
        if (error) {
          console.error('Error deleting wine:', error);
          reject({ error: 'Error deleting wine' });
        } else {
          console.log('Wine deleted successfully.');
          resolve({ message: 'Wine deleted successfully.' });
        }
      });
    });
  }

  updateWine(wineId, nom, description, embouteillage, cepage, chateau, prix) {
    const updateWineQuery = 'UPDATE winebottle SET nom = ?, description = ?, embouteillage = ?, cepage = ?, chateau = ?, prix = ? WHERE id = ?';
    const values = [nom, description, embouteillage, cepage, chateau, prix, wineId];
    return new Promise((resolve, reject) => {
      db.query(updateWineQuery, values, (error) => {
        if (error) {
          console.error('Error updating wine:', error);
          reject({ error: 'Error updating wine' });
        } else {
          console.log('Wine updated successfully.');
          resolve({ message: 'Wine updated successfully.' });
        }
      });
    });
  }

  getWineByName(wineName) {
    const getWineByNameQuery = 'SELECT * FROM winebottle WHERE nom = ?';
    return new Promise((resolve, reject) => {
      db.query(getWineByNameQuery, [wineName], (error, results) => {
        if (error) {
          console.error('Error fetching wine by name:', error);
          reject({ error: 'Internal Server Error' });
        } else {
          if (results.length > 0) {
            const wine = results[0];
            resolve(wine);
          } else {
            console.log('Wine not found.');
            reject({ error: 'Wine not found.' });
          }
        }
      });
    });
  }


  searchWinesByName(query) {
    const searchWinesQuery = 'SELECT * FROM winebottle WHERE nom LIKE ?';
    const searchTerm = `%${query}%`; 
    return new Promise((resolve, reject) => {
      db.query(searchWinesQuery, [searchTerm], (error, results) => {
        if (error) {
          console.error('Error searching wines by name:', error);
          reject({ error: 'Internal Server Error' });
        } else {
          console.log('Wines found:', results);
          resolve(results);
        }
      });
    });
  }
  

}

module.exports = new WineModel();
