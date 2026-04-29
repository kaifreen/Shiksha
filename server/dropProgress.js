const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const db = mongoose.connection.db;
      await db.dropCollection('userprogresses');
      console.log("Successfully removed the userprogresses collection from MongoDB.");
    } catch (err) {
      if (err.code === 26) {
        console.log("Collection 'userprogresses' does not exist or is already deleted.");
      } else {
        console.error("Error dropping collection:", err);
      }
    }
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
