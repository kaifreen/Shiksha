const express = require('express');
const UserProgress = require('../models/UserProgress');

const router = express.Router();

// Get user progress for a course
router.get('/:userId/:courseId', async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      userId: req.params.userId,
      courseId: req.params.courseId
    });
    res.json(progress || { videosWatched: [], completionPercentage: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all progress for user
router.get('/user/:userId', async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.params.userId });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save or update progress
router.post('/save', async (req, res) => {
  try {
    const { userId, courseId, videosWatched, completionPercentage } = req.body;

    let progress = await UserProgress.findOne({ userId, courseId });

    if (progress) {
      progress.videosWatched = videosWatched;
      progress.completionPercentage = completionPercentage;
      progress.updatedAt = new Date();
      await progress.save();
    } else {
      progress = new UserProgress({
        userId,
        courseId,
        videosWatched,
        completionPercentage
      });
      await progress.save();
    }

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark video as watched
router.post('/watch-video', async (req, res) => {
  try {
    const { userId, courseId, videoId } = req.body;

    let progress = await UserProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = new UserProgress({ userId, courseId, videosWatched: [videoId] });
    } else if (!progress.videosWatched.includes(videoId)) {
      progress.videosWatched.push(videoId);
    }

    progress.updatedAt = new Date();
    await progress.save();

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
