const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function migratePasswordField() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Get MongoDB URI from environment or command line argument
    const mongoUri = process.env.MONGODB_URI || process.argv[2];
    
    if (!mongoUri) {
      console.error('❌ MongoDB URI not provided!');
      console.error('Usage: node migratePassword.js <MONGODB_URI>');
      console.error('Or set MONGODB_URI in .env file');
      process.exit(1);
    }
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`\n📊 Found ${users.length} users to update`);

    if (users.length === 0) {
      console.log('✨ No users to update');
      process.exit(0);
    }

    // Update each user with encrypted password
    let updatedCount = 0;
    const passwords = {}; // Store generated passwords for reference

    for (const user of users) {
      // Check if user already has a password
      if (user.password) {
        console.log(`⏭️  User ${user.email} already has a password, skipping...`);
        continue;
      }

      try {
        // Generate a temporary password: Shiksha2024_[firstLetterOfEmail]
        const firstLetter = user.email.charAt(0).toUpperCase();
        const tempPassword = `Shiksha2024_${firstLetter}`;
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

        // Update user directly in database with encrypted password
        await User.updateOne(
          { _id: user._id },
          { 
            $set: { 
              password: hashedPassword,
              updatedAt: new Date()
            } 
          }
        );
        
        passwords[user.email] = tempPassword;
        updatedCount++;
        console.log(`✅ Updated user: ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to update ${user.email}: ${error.message}`);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`📈 ${updatedCount} users updated with encrypted passwords`);
    
    if (updatedCount > 0) {
      console.log('\n🔐 Temporary passwords generated (format: Shiksha2024_[FirstLetter])');
      console.log('   Users should be prompted to change their passwords on first login');
      console.log('\n📋 Sample user data:');
      const sampleUser = await User.findOne({ email: Object.keys(passwords)[0] });
      if (sampleUser) {
        console.log(`   Email: ${sampleUser.email}`);
        console.log(`   Has encrypted password: ${sampleUser.password ? '✅ Yes' : '❌ No'}`);
        console.log(`   Password length: ${sampleUser.password.length} characters`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migratePasswordField();
