const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authMiddleware } = require('./questions');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const users = await User.find({}, '-password');
  res.json(users);
});

router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { email, password, role } = req.body;
  const user = new User({ email, password, role });
  await user.save();
  res.status(201).json({ message: 'User added' });
});

router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { email, role } = req.body;
  const updateData = { email, role };
  if (req.body.password) {
    updateData.password = await bcrypt.hash(req.body.password, 10);
  }
  const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(user);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;