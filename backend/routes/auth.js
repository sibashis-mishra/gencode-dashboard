import express from 'express';
import { registerUser, loginUser, validateToken, getUserById } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/validate', validateToken);
router.get('/users/:id', authMiddleware, getUserById);

export default router;
