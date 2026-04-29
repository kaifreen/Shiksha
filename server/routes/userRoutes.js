const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Save or update user when they login
router.post('/save', async (req, res) => {
  try {
    const { uid, email, displayName, ...otherDetails } = req.body;

    let user = await User.findOne({ uid });

    if (user) {
      // Update existing user
      user = await User.findByIdAndUpdate(
        user._id,
        { email, displayName, ...otherDetails, updatedAt: new Date() },
        { new: true }
      );
    } else {
      // Create new user
      user = new User({
        uid,
        email,
        displayName,
        ...otherDetails
      });
      await user.save();
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user profile by UID
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:uid', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.params.uid },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
