const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  description: String,
  videoUrl: String,
  thumbnail: String,
  duration: Number,
  sequenceNumber: Number,
  isPreview: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);
