const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Firebase Auth Details
  uid: {
    type: String,
    required: true,
    unique: true
  },
  
  // Basic Information
  email: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  fullName: String,
  phone: String,
  profilePic: String,
  bio: String,
  
  // Accessibility & Special Needs
  disabilityType: {
    type: String,
    default: "none"
  },
  needsSpecialAssistance: {
    type: Boolean,
    default: false
  },
  
  // Learning Preferences
  learningStyle: {
    type: String,
    default: "visual"
  },
  languagePreference: {
    type: String,
    default: "english"
  },
  
  // Accessibility Settings
  accessibilityMode: {
    type: Boolean,
    default: false
  },
  fontSize: {
    type: String,
    default: "medium"
  },
  dyslexiaFont: {
    type: Boolean,
    default: false
  },
  highContrast: {
    type: Boolean,
    default: false
  },
  textToSpeech: {
    type: Boolean,
    default: false
  },
  
  // User Agreements
  termsAccepted: {
    type: Boolean,
    default: false
  },
  privacyAccepted: {
    type: Boolean,
    default: false
  },
  termsAcceptedAt: Date,
  privacyAcceptedAt: Date,
  
  // Metadata
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
