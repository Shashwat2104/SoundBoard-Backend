const mongoose = require("mongoose");

const mixdownExportSchema = new mongoose.Schema({
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
  fileName: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    enum: ['wav', 'mp3'],
    default: 'wav'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MixdownExport = mongoose.model("MixdownExport", mixdownExportSchema);

module.exports = MixdownExport;