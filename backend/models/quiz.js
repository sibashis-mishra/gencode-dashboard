const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String, // Optional for quizzes
    points: Number
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // Field to track the last update time
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Field to track the user who made the update
});

// Middleware to update the `updatedAt` field before saving
quizSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);
