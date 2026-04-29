const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get courses by subject
router.get('/subject/:subject', async (req, res) => {
  try {
    const courses = await Course.find({ subject: req.params.subject });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new course (admin)
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update course (admin)
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/courses/enroll — increment enrolledCount by subject
router.post('/enroll', async (req, res) => {
  const { subject } = req.body;
  if (!subject) return res.status(400).json({ error: 'subject is required' });
  try {
    const course = await Course.findOneAndUpdate(
      { subject },
      { $inc: { enrolledCount: 1 } },
      { new: true }
    );
    // If no matching course in DB, return a count of 1 gracefully
    res.json({ success: true, enrolledCount: course ? course.enrolledCount : 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/courses/rate — submit a 1-5 star rating, computes rolling average
router.post('/rate', async (req, res) => {
  const { subject, rating } = req.body;
  if (!subject || rating == null) return res.status(400).json({ error: 'subject and rating are required' });

  const newRating = Math.min(5, Math.max(1, parseFloat(rating)));

  try {
    const course = await Course.findOne({ subject });
    if (!course) {
      // Course not in DB yet — return the given rating as-is
      return res.json({ success: true, rating: newRating });
    }

    // Rolling average: new = (old * ratingCount + newRating) / (ratingCount + 1)
    const prevCount = course.ratingCount || 0;
    const prevRating = course.rating || 0;
    const newCount = prevCount + 1;
    const avgRating = parseFloat(((prevRating * prevCount + newRating) / newCount).toFixed(1));

    course.rating = avgRating;
    course.ratingCount = newCount;
    await course.save();

    res.json({ success: true, rating: avgRating, ratingCount: newCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/courses/stats/:subject — get rating, enrolledCount, videoCount, price for a subject
router.get('/stats/:subject', async (req, res) => {
  try {
    const course = await Course.findOne({ subject: req.params.subject });
    if (!course) return res.json({ rating: 0, enrolledCount: 0, videoCount: 0, price: 0, ratingCount: 0 });
    res.json({
      rating: course.rating,
      enrolledCount: course.enrolledCount,
      videoCount: course.videoCount,
      price: course.price,
      ratingCount: course.ratingCount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

