const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');

exports.submitQuiz = async (req, res) => {
    try {
      const { quizId, fullName, answers } = req.body;
      const submission = new Submission({ quiz: quizId, user: fullName, answers });
  
      // Calculate score logic (replace with your specific logic)
      let score = 0;
      const quiz = await Quiz.findById(quizId);
      for (const answer of answers) {
        const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
        if (question && question.correctAnswer === answer.answer) {
          score += question.points;
        }
      }
      submission.score = score; 
  
      const savedSubmission = await submission.save();
      res.status(201).json({ ...savedSubmission.toJSON(), score });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.getQuizSubmissions = async (req, res) => {
    try {
      const { quizId } = req.params; // Get quiz ID from URL parameter
  
      const submissions = await Submission.find({ quiz: quizId }); // Filter by quiz ID
  
      if (!submissions) {
        return res.status(404).json({ message: 'No submissions found for this quiz' });
      }
  
      res.status(200).json(submissions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };