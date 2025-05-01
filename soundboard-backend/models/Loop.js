const mongoose = require("mongoose");

const loopSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JamRoom",
    required: true,
  },
  audioUrl: {
    type: String,
    required: true,
  },
  trackName: {
    type: String,
    required: true,
  },
  trackOrder: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Loop = mongoose.model("Loop", loopSchema);

module.exports = Loop;
