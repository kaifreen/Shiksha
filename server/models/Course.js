const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  subject: {
    type: String,
    enum: ['Mathematics', 'Science', 'English', 'Hindi'],
    required: true
  },
  instructor: String,
  instructorImg: String,
  thumbnail: String,
  videoCount: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration: String,
  rating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Third argument sets the exact MongoDB collection name → "CourseCatalogue"
module.exports = mongoose.model('Course', courseSchema, 'CourseCatalogue');
