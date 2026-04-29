const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  profilePic: String,
  bio: String,
  phone: String,
  disabilityType: String,
  needsSpecialAssistance: Boolean,
  learningStyle: String,
  languagePreference: String,
  accessibilityMode: Boolean,
  fontSize: String,
  dyslexiaFont: Boolean,
  highContrast: Boolean,
  textToSpeech: Boolean,
  enrolledCourses: [String],
  completedCourses: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
