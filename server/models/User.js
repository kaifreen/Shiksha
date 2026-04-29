const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  password: {
    type: String,
    required: true,
    minlength: 6
  },
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

// Pre-save hook to encrypt password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user without sensitive data
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password; // Don't return password in JSON
  return user;
};

module.exports = mongoose.model('User', userSchema);
