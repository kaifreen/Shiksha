const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  videosWatched: [String],
  completionPercentage: {
    type: Number,
    default: 0
  },
  lastWatchedVideo: String,
  notes: String,
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserProgress', progressSchema);
