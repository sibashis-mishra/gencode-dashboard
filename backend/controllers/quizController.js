const Quiz = require('../models/Quiz');

exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const quiz = new Quiz({ title, creator: req.user._id, questions });
    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, questions } = req.body;

    const quiz = await Quiz.findByIdAndUpdate(id, { title, questions }, { new: true });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getQuizById = async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await Quiz.findById(id);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found'   
   });
      }
      res.json(quiz);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message:   
   'Server error' });
    }
  };