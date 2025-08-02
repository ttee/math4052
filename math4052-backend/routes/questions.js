const express = require('express');
const jwt = require('jsonwebtoken');
const Question = require('../models/Question');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);
  
  const token = authHeader?.split(' ')[1];
  console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'No token');
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Unauthorized - No token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded user:', { id: decoded.id, role: decoded.role });
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const router = express.Router();

router.get('/', async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

router.get('/random/:count', async (req, res) => {
  const count = parseInt(req.params.count) || 5;
  const questions = await Question.aggregate([{ $sample: { size: count } }]);
  res.json(questions);
});

router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const question = new Question(req.body);
  await question.save();
  res.status(201).json(question);
});

router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(question);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = { router, authMiddleware };