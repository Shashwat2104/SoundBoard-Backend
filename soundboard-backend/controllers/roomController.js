const JamRoom = require("../models/JamRoom");
const User = require("../models/User");

const createRoom = async (req, res) => {
  const { name, description, bpm, keySignature, isPrivate } = req.body;

  try {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const room = new JamRoom({
      title: name,           // Map name to title
      description,          // Add description field
      bpm,
      keySignature,
      roomCode,
      isPrivate,
      creator: req.user._id,
      participants: [req.user._id],
      createdAt: Date.now()
    });

    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await JamRoom.find({ isPrivate: false })
      .populate('participants', 'name')
      .sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

const getRoomDetails = async (req, res) => {
  try {
    const room = await JamRoom.findOne({ roomCode: req.params.roomCode })
      .populate('participants', 'name')
      .populate('loops');
    
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: "Error fetching room details" });
  }
};

const createJamRoom = async (req, res) => {
  const { title, bpm, keySignature, isPrivate } = req.body;

  try {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const room = new JamRoom({
      title,
      bpm,
      keySignature,
      roomCode,
      isPrivate,
      creator: req.user._id,
      participants: [req.user._id],
      createdAt: Date.now()
    });

    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const uploadTrackToRoom = async (req, res) => {
  try {
    const { roomCode } = req.params;
    
    // Check if room exists
    const room = await JamRoom.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    
    // Handle file upload (you'll need multer middleware for this)
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // Create a new track
    const track = {
      name: req.body.name,
      filePath: req.file.path,
      uploadedBy: req.user._id,
      createdAt: Date.now()
    };
    
    // Add track to room
    room.tracks = room.tracks || [];
    room.tracks.push(track);
    await room.save();
    
    res.status(201).json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add this to your exports
module.exports = { createRoom, getRooms, getRoomDetails, createJamRoom, uploadTrackToRoom };
