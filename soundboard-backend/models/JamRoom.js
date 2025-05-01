const mongoose = require("mongoose");

const jamRoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  bpm: {
    type: Number,
    required: true,
  },
  keySignature: {
    type: String,
    required: true,
  },
  roomCode: {
    type: String,
    required: true,
    unique: true,
  },
  isPrivate: {
    type: Boolean,
    default: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  loops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loop",
    },
  ],
  // Add this to your JamRoom schema
  tracks: [
    {
      name: String,
      filePath: String,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const JamRoom = mongoose.model("JamRoom", jamRoomSchema);

module.exports = JamRoom;
