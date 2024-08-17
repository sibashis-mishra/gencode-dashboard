const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  user: { type: String }, // Store user's name for simplicity
  answers: [{
    questionId: String,
    answer: String
  }],
  score: { type: Number },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);