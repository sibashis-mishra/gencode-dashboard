const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/validate', userController.validateToken);
router.get('/users/:id', authMiddleware, userController.getUserById)

module.exports = router;