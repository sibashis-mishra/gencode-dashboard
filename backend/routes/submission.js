const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const submissionController = require('../controllers/submissionController');

router.post('/submissions', submissionController.submitQuiz);
router.get('/quizzes/:quizId/submissions', authMiddleware, submissionController.getQuizSubmissions);

module.exports = router;