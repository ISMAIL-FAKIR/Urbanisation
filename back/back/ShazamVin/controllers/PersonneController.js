const personneModel = require('../models/PersonneModel');

class PersonneController {
  registerUser(req, res) {
    const { nom, prenom, email, password, role } = req.body;
    personneModel.createUser(nom, prenom, email, password, role)
      .then((insertedUser) => res.status(200).json({
        message: 'User registered successfully.',
        user: insertedUser,
      }))
      .catch((error) => res.status(500).json({ error: 'Error creating user', details: error }));
  }

  loginUser(req, res) {
    const { email, password } = req.body;
    personneModel.authenticateUser(email, password)
      .then((userInfo) => res.status(200).json({
        message: 'User authenticated successfully.',
        user: userInfo,
      }))
      .catch((error) => {
        if (error === 'User not found.' || error === 'Invalid password') {
          res.status(401).json({ error });
        } else {
          res.status(500).json({ error: 'Error authenticating user', details: error });
        }
      });
  }

  logoutUser(req, res) {
    const { userId } = req.body;
    personneModel.logoutUser(userId)
      .then(() => res.status(200).json({ message: 'User logged out successfully.' }))
      .catch((error) => res.status(500).json({ error: 'Error logging out user', details: error }));
  }

  updateUser(req, res) {
    const { userId, nom, prenom, email, password, role } = req.body;
    personneModel.updateUser(userId, nom, prenom, email, password, role)
      .then((updatedUser) => res.status(200).json({
        message: 'User updated successfully.',
        user: updatedUser,
      }))
      .catch((error) => res.status(500).json({ error: 'Error updating user', details: error }));
  }

  deleteUser(req, res) {
    const { userId } = req.body;
    personneModel.deleteUser(userId)
      .then(() => res.status(200).json({ message: 'User deleted successfully.' }))
      .catch((error) => res.status(500).json({ error: 'Error deleting user', details: error }));
  }

  getAllUsers(req, res) {
    personneModel.getUsers()
      .then((users) => res.status(200).json({
        message: 'Users fetched successfully.',
        users,
      }))
      .catch((error) => res.status(500).json({ error: 'Error fetching all users', details: error }));
  }
}

module.exports = new PersonneController();

