const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    // We can interact directly with the collection to bypass schema restrictions if needed, 
    // but the User model is fine since we are just unsetting.
    const db = mongoose.connection.db;
    await db.collection('users').updateMany({}, { $unset: { enrolledCourses: "", completedCourses: "" } });
    console.log("Successfully removed enrolledCourses and completedCourses from all users.");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
