const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve video files from src/Videos folder
app.use('/videos', express.static(path.join(__dirname, '../src/Videos')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Shiksha Backend API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
