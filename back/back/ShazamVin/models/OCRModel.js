const Tesseract = require('tesseract.js');
const Levenshtein = require('fast-levenshtein');
const WineModel = require('./WineModel');
const axios = require('axios');
const fs = require('fs').promises;


class OCRModel {

  async processImage(imageData) {
    try {
      const extractedText = await this.extractTextFromImage(imageData);
      console.log('Extracted Text:', extractedText);
      const matchedWine = await this.matchTextWithDatabase(extractedText);
  
      return { extractedText, matchedWine };
    } catch (error) {
      throw error;
    }
  }
  

  async getImageData(imageData) {
    try {
      return imageData;
    } catch (error) {
      console.error('Error reading image data:', error);
      throw { error: 'Error reading image data' };
    }
  }

  matchTextWithDatabase(text) {
    const similarityThreshold = 0.02; 
    return new Promise(async (resolve, reject) => {
      try {
        const allWines = await WineModel.getAllWines();
        let bestMatch = null;
        let bestMatchScore = 0;

        allWines.forEach((wine) => {
          const fieldsToCompare = [wine.nom, wine.description, wine.chateau].join(' ').toLowerCase();
          
          const similarityScore = this.calculateLevenshteinDistance(text, fieldsToCompare);
          
          if (similarityScore > bestMatchScore) {
            bestMatch = wine;
            bestMatchScore = similarityScore;
          }
        });

        if (bestMatchScore >= similarityThreshold) {
          resolve(bestMatch);
        } else {
          reject({ error: 'No matching wine found.' });
        }
      } catch (error) {
        console.error('Error matching text with database:', error.message);
        reject({ error: 'Error matching text with database' });
      }
    });
  }

  calculateLevenshteinDistance(text1, text2) {
    const distance = Levenshtein.get(text1, text2);
    console.log('Levenshtein distance:', 1 - distance / Math.max(text1.length, text2.length));
    return 1 - distance / Math.max(text1.length, text2.length);
  }

  extractTextFromImage(imageData) {
    return new Promise((resolve, reject) => {
        Tesseract.recognize(
            imageData,
            'eng',
            {
                logger: m => console.log(m),
                regex: '^[A-Za-z0-9 ]+$' // Allow A-Z, a-z, 0-9, and space
            }
        ).then(({ data: { text } }) => {
            console.log('Raw text:', text); // Log raw text for inspection
            resolve(text.trim());
        }).catch((error) => {
            console.error('Error extracting text:', error);
            reject('Error extracting text');
        });
    });
}

}

module.exports = new OCRModel();