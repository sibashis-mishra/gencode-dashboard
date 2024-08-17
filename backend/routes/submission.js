const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const submissionController = require('../controllers/submissionController');

router.post('/', submissionController.submitQuiz);
router.get('/quizzes/:quizId', authMiddleware, submissionController.getQuizSubmissions);

module.exports = router;