const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config();

// Load Models
const Course = require('./models/Course');
const Video = require('./models/Video');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.error(err));

// Read JSON files
const courses = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'courses.json'), 'utf-8')
);

const videos = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'videos.json'), 'utf-8')
);

// Import Data
const importData = async () => {
  try {
    // 1. Clear existing data
    await Course.deleteMany();
    await Video.deleteMany();
    console.log('Previous Courses & Videos Destroyed...');

    // 2. Insert Courses
    const createdCourses = await Course.insertMany(courses);
    console.log('Courses Imported!');

    // Create a dictionary to map subject name to course ID
    const courseIdMap = {};
    createdCourses.forEach(course => {
      courseIdMap[course.subject] = course._id;
    });

    // 3. Insert Videos, linking them to their corresponding courses
    const videosWithCourseId = videos.map(video => {
      return {
        ...video,
        courseId: courseIdMap[video.subject]
      };
    });

    await Video.insertMany(videosWithCourseId);
    console.log('Videos Imported!');

    console.log('✅ Data Import Success');
    process.exit();
  } catch (err) {
    console.error('❌ Data Import Failed:', err);
    process.exit(1);
  }
};

importData();
