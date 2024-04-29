const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/forgot-password', UserController.forgotPassword);
router.post('/signup', UserController.signup);
router.get('/details', authenticateToken, UserController.getUserDetails);
router.post('/reset-password', UserController.resetPassword);

module.exports = router;
