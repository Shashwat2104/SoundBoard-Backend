const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,  // Allows null values and maintains uniqueness for non-null values
    trim: true,
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
