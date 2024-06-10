const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
// Enable CORS
app.use(cors())
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Database connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Use routes
app.use(taskRoutes);
app.use(authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
