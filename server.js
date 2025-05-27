const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const cors = require('cors');
const helmet = require('helmet');
const contactRoutes = require('./routes/contactRoutes');
const config = require('./config');

const app = express();
const port = process.env.PORT || config.port; // Use Render's PORT env variable or fallback to config

const dbURI = process.env.MONGODB_URI || config.mongodbURI; // Use Render's MONGODB_URI or fallback to config

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

app.get('/', (req, res) => {
  res.send('Contact Us Backend is running!');
});

app.use('/contact', contactRoutes); // Mount contact routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle Express-validator errors
  if (err.array) {
    return res.status(400).json({ errors: err.array() });
  }

  // Handle Mongoose validation errors (optional, express-validator covers basic required/format)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    return res.status(400).json({ message: errors });
  }

  // Generic server error
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`MongoDB connected: ${dbURI}`);
}); 