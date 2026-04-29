const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function migrateUserData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Get MongoDB URI from environment or command line argument
    const mongoUri = process.env.MONGODB_URI || process.argv[2];
    
    if (!mongoUri) {
      console.error('❌ MongoDB URI not provided!');
      console.error('Usage: node migrateUserData.js <MONGODB_URI>');
      console.error('Or set MONGODB_URI in .env file');
      process.exit(1);
    }
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get current database
    const db = mongoose.connection.db;
    const adminDb = db.admin();
    const databases = await adminDb.listDatabases();
    
    console.log('\n📚 Available databases:');
    databases.databases.forEach(dbInfo => {
      console.log(`   - ${dbInfo.name} (${(dbInfo.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    // Get user collection info
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Collections in current database:');
    collections.forEach(col => console.log(`   - ${col.name}`));

    // Get all users
    const users = await User.find({});
    console.log(`\n📊 Found ${users.length} users to update`);

    // Update each user with new fields if they don't exist
    let updatedCount = 0;
    const now = new Date();

    for (const user of users) {
      let needsUpdate = false;

      // Check if user needs updates
      if (!user.fullName && user.displayName) {
        user.fullName = user.displayName;
        needsUpdate = true;
      }

      if (user.termsAccepted === undefined || user.termsAccepted === null) {
        user.termsAccepted = true; // Set to true for existing users
        user.termsAcceptedAt = user.createdAt || now;
        needsUpdate = true;
      }

      if (user.privacyAccepted === undefined || user.privacyAccepted === null) {
        user.privacyAccepted = true; // Set to true for existing users
        user.privacyAcceptedAt = user.createdAt || now;
        needsUpdate = true;
      }

      // Set defaults for accessibility fields if not present
      if (user.disabilityType === undefined) {
        user.disabilityType = 'none';
        needsUpdate = true;
      }

      if (user.learningStyle === undefined) {
        user.learningStyle = 'visual';
        needsUpdate = true;
      }

      if (user.languagePreference === undefined) {
        user.languagePreference = 'english';
        needsUpdate = true;
      }

      if (user.fontSize === undefined) {
        user.fontSize = 'medium';
        needsUpdate = true;
      }

      // Set boolean defaults if not present
      const booleanFields = [
        'needsSpecialAssistance',
        'accessibilityMode',
        'dyslexiaFont',
        'highContrast',
        'textToSpeech'
      ];

      for (const field of booleanFields) {
        if (user[field] === undefined || user[field] === null) {
          user[field] = false;
          needsUpdate = true;
        }
      }

      // Update user if there were changes
      if (needsUpdate) {
        user.updatedAt = now;
        await user.save();
        updatedCount++;
        console.log(`✅ Updated user: ${user.email}`);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`📈 ${updatedCount} users updated with signup data`);
    console.log(`✨ All users now have complete profile data stored in MongoDB`);

    // Display sample of updated user
    if (users.length > 0) {
      const sampleUser = await User.findOne({});
      console.log('\n📋 Sample updated user data:');
      console.log(JSON.stringify(sampleUser, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateUserData();
