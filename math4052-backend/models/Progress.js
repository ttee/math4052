const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  attempts: { type: Number, default: 0 },
  correct: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 }, // For multi-question sessions
});

module.exports = mongoose.model('Progress', progressSchema);