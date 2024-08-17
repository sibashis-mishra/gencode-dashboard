const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, quizController.getAllQuizzes);
router.post('/', authMiddleware, quizController.createQuiz);
router.put('/:id', authMiddleware, quizController.updateQuiz);
router.get('/:id', authMiddleware, quizController.getQuizById);
router.delete('/:id', authMiddleware, quizController.deleteQuiz); 

module.exports = router;