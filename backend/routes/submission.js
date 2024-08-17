import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { submitQuiz, getQuizSubmissions, getAllSubmissions } from '../controllers/submissionController.js';

const router = express.Router();

router.post('/', submitQuiz);
router.get('/quizzes/:quizId', authMiddleware, getQuizSubmissions);
router.get('/', authMiddleware, getAllSubmissions);

export default router;
