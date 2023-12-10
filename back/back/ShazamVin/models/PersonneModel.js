const e = require('express');
const db = require('../utils/db');
const bcrypt = require('bcrypt');
const { get } = require('fast-levenshtein');

class PersonneModel {
  createUser(nom, prenom, email, password, role) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const getUserByEmailQuery = 'SELECT * FROM personne WHERE email = ?';
    const insertUserQuery = 'INSERT INTO personne (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)';
    const values = [nom, prenom, email, hashedPassword, role];

    return new Promise((resolve, reject) => {
      // Check if a user with the same email already exists
      db.query(getUserByEmailQuery, [email], (error, results) => {
        if (error) {
          console.error('Error checking existing user:', error);
          reject({ error: 'Internal Server Error' });
        } else {
          if (results.length > 0) {
            // User with the same email already exists
            console.error('User with the same email already exists.');
            reject({ error: 'User with the same email already exists.' });
          } else {
            // No existing user with the same email, proceed with registration
            db.query(insertUserQuery, values, (error, result) => {
              if (error) {
                console.error('Error creating user:', error);
                reject({ error: 'Error creating user' });
              } else {
                // Resolve with the inserted user details
                const insertedUser = {
                  id: result.insertId,
                  nom,
                  prenom,
                  email,
                  role,
                };

                console.log('User created successfully.');
                resolve(insertedUser);
              }
            });
          }
        }
      });
    });
  }
  authenticateUser(email, password) {
    const getUserQuery = 'SELECT * FROM personne WHERE email = ?';
    return new Promise((resolve, reject) => {
      db.query(getUserQuery, [email], (error, results) => {
        if (error) {
          console.error('Error fetching user:', error);
          reject({ error: 'Internal Server Error' });
        } else {
          if (results.length > 0) {
            const user = results[0];
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (isPasswordValid) {
              const updateUserQuery = 'UPDATE personne SET connected = ? WHERE id = ?';
              const values = [true, user.id];
              db.query(updateUserQuery, values, (updateError) => {
                if (updateError) {
                  user.connected = false;
                  console.error('Error updating user:', updateError);
                  reject({ error: 'Error updating user' });
                } else {
                  user.connected = true;
                  console.log('User authenticated successfully.');
                  console.log(user.connected);
                  resolve({
                    id: user.id,
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    role: user.role,
                    connected: user.connected,
                  });
                }
              });
            } else {
              console.error('Invalid password');
              reject({ error: 'Invalid password' });
            }
          } else {
            console.error('User not found.');
            reject({ error: 'User not found.' });
          }
        }
      });
    });
  }
  
  logoutUser(userId) {
    const updateUserQuery = 'UPDATE personne SET connected = ? WHERE id = ?';
    const values = [false, userId];
    return new Promise((resolve, reject) => {
      db.query(updateUserQuery, values, (error) => {
        if (error) {
          console.error('Error updating user:', error);
          reject({ error: 'Error updating user' });
        } else {
          console.log('User logged out successfully.');
          resolve({ message: 'User logged out successfully.' });
        }
      });
    });
  }

  updateUser(userId, nom, prenom, email, password, role) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const updateUserQuery = 'UPDATE personne SET nom = ?, prenom = ?, email = ?, password = ?, role = ? WHERE id = ?';
    const values = [nom, prenom, email, hashedPassword, role, userId];

    return new Promise((resolve, reject) => {
      db.query(updateUserQuery, values, (error) => {
        if (error) {
          console.error('Error updating user:', error);
          reject({ error: 'Error updating user' });
        } else {
          console.log('User updated successfully.');
          const updatedUser = {
            id: userId,
            nom,
            prenom,
            email,
            role,
          };
          resolve(updatedUser);
        }
      });
    });
  }

  deleteUser(userId) {
    const deleteUserQuery = 'DELETE FROM personne WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.query(deleteUserQuery, [userId], (error) => {
        if (error) {
          console.error('Error deleting user:', error);
          reject({ error: 'Error deleting user' });
        } else {
          console.log('User deleted successfully.');
          resolve({ message: 'User deleted successfully.' });
        }
      });
    });
  }

  getUsers() {
    const getUsersQuery = 'SELECT * FROM personne';
    return new Promise((resolve, reject) => {
      db.query(getUsersQuery, (error, results) => {
        if (error) {
          console.error('Error fetching all users:', error);
          reject({ error: 'Error fetching all users' });
        } else {
          console.log('All users fetched successfully.');
          resolve(results);
        }
      });
    });
  }
}

module.exports = new PersonneModel();
