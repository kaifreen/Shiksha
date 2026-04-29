const express = require('express');
const Video = require('../models/Video');
const Course = require('../models/Course');

const router = express.Router();

// Subject mapping: Video courseId → Course subject enum
const courseIdToSubject = {
  'Maths': 'Mathematics',
  'Mathematics': 'Mathematics',
  'Science': 'Science',
  'English': 'English',
  'Hindi': 'Hindi'
};

// GET real video count for a courseId
router.get('/count/:courseId', async (req, res) => {
  try {
    const count = await Video.countDocuments({ courseId: req.params.courseId });
    res.json({ courseId: req.params.courseId, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all videos for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const videos = await Video.find({ courseId: req.params.courseId }).sort({ sequenceNumber: 1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ courseId: 1, sequenceNumber: 1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST — Add a new video to a course
router.post('/add', async (req, res) => {
  try {
    const { title, courseId, description, videoUrl, thumbnail, duration, sequenceNumber, isPreview } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({ error: 'Title and courseId are required.' });
    }

    const video = new Video({
      title,
      courseId,
      description: description || '',
      videoUrl: videoUrl || '',
      thumbnail: thumbnail || '',
      duration: duration || 0,
      sequenceNumber: sequenceNumber || 0,
      isPreview: isPreview || false,
    });

    await video.save();

    // Auto-update Course videoCount with real count from DB
    const subject = courseIdToSubject[courseId];
    if (subject) {
      const realCount = await Video.countDocuments({ courseId });
      await Course.findOneAndUpdate(
        { subject },
        { $set: { videoCount: realCount } }
      );
    }

    res.status(201).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a video by ID
router.delete('/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Video deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
