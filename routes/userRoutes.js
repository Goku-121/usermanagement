const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Auth
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// User CRUD
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Extra Features
router.post('/change-password', userController.changePassword);
router.put('/update-profile', userController.updateProfile);
router.put('/make-admin/:id', userController.makeAdmin);
router.put('/remove-admin/:id', userController.removeAdmin);
router.get('/search', userController.searchUsers);
router.get('/filter', userController.filterUsers);
router.put('/block/:id', userController.blockUser);
router.put('/unblock/:id', userController.unblockUser);

module.exports = router;
