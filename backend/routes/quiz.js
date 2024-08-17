const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/quizzes', authMiddleware, quizController.getAllQuizzes);
router.post('/quizzes', authMiddleware, quizController.createQuiz);
router.put('/quizzes/:id', authMiddleware, quizController.updateQuiz);
router.get('/quizzes/:id', authMiddleware, quizController.getQuizById);

module.exports = router;