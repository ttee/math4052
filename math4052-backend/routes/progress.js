const express = require('express');
const Progress = require('../models/Progress');
const { authMiddleware } = require('./questions');

const router = express.Router();

// Leaderboard route must come BEFORE /:userId route
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Progress.aggregate([
      { $group: { _id: '$userId', totalScore: { $sum: '$score' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $project: { username: { $arrayElemAt: ['$user.email', 0] }, totalScore: 1 } },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
    ]);
    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Error fetching leaderboard' });
  }
});

router.get('/:userId', authMiddleware, async (req, res) => {
  if (req.user.id !== req.params.userId && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const progress = await Progress.find({ userId: req.params.userId });
  res.json(progress);
});

router.post('/', authMiddleware, async (req, res) => {
  const { userId, questionId, attempts, correct, score } = req.body;
  if (req.user.id !== userId) return res.status(403).json({ error: 'Forbidden' });
  let progress = await Progress.findOne({ userId, questionId });
  if (!progress) progress = new Progress({ userId, questionId });
  progress.attempts = attempts;
  progress.correct = correct;
  progress.score = score;
  await progress.save();
  res.json(progress);
});

module.exports = router;