const Loop = require("../models/Loop");
const User = require("../models/User");
const JamRoom = require("../models/JamRoom");
const fs = require('fs');
const path = require('path');

exports.saveLoop = async (req, res) => {
  try {
    // First find the room by roomCode
    const room = await JamRoom.findOne({ roomCode: req.params.roomCode });
    
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Handle file upload
    if (!req.file) {
      return res.status(400).json({ msg: 'No audio file provided' });
    }

    // Create a unique filename
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = `/uploads/loops/${fileName}`;
    
    // Create loop record
    const loop = new Loop({
      user: req.user._id,
      room: room._id,
      audioUrl: filePath,
      trackName: req.body.name,
      trackOrder: req.body.order || 0,
      timestamp: new Date(),
    });

    await loop.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalLoops: 1 },
    });

    res.status(201).json(loop);
  } catch (err) {
    console.error('Error saving loop:', err);
    res.status(500).json({ msg: "Error saving loop" });
  }
};

exports.getLoopsByRoom = async (req, res) => {
  try {
    // Check for since parameter to only get new loops
    const since = req.query.since ? new Date(req.query.since) : null;
    
    // First find the room by its code
    const room = await JamRoom.findOne({ roomCode: req.params.roomCode });
    
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }
    
    // Build query - optionally filter by timestamp
    const query = { room: room._id };
    if (since) {
      query.timestamp = { $gt: since };
    }
    
    // Then find loops using the room's ObjectId
    const loops = await Loop.find(query)
      .populate('user', 'name')
      .sort({ timestamp: 1 });
      
    // Return loops with current server timestamp
    res.json({
      loops,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error fetching loops:', err);
    res.status(500).json({ msg: 'Error fetching loops' });
  }
};
