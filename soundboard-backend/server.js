const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const authRoutes = require("./routes/auth");
const loopsRouter = require('./routes/loops');
const roomsRouter = require('./routes/rooms');
const userRoutes = require('./routes/users');
const mixdownsRouter = require('./routes/mixdowns');
require("dotenv").config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());
// Add this after other middleware
app.use(express.static('public'));
// Make sure uploads directory is served statically
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/rooms', require('./routes/rooms'));
app.use('/loops', require('./routes/loops'));
app.use('/users', userRoutes);
app.use('/mixdowns', mixdownsRouter); // Add this line

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
