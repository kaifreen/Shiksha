const express = require('express');
const Feedback = require('../models/Feedback');

const router = express.Router();

// @route   POST /api/feedback
// @desc    Submit a new feedback
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and message' });
    }

    const newFeedback = new Feedback({
      name,
      email,
      message
    });

    await newFeedback.save();

    res.status(201).json({ success: true, data: newFeedback });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/feedback
// @desc    Get all feedback (for admin)
// @access  Public (Should be protected in production)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
