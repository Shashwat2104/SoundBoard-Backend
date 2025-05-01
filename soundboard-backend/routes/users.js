const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const JamRoom = require('../models/JamRoom'); // Import your room model
const MixdownExport = require('../models/MixdownExport');

// Get current user data
router.get('/me', auth, async (req, res) => {
  try {
    // The auth middleware already adds user ID to req.user
    const userId = req.user._id;
    
    // Fetch user from database
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rooms created by a specific user
router.get('/:userId/rooms', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find rooms where the creator is the specified user
    const rooms = await JamRoom.find({ creator: userId });
    
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching user rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics - optimized version
router.get('/:userId/stats', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Use MongoDB aggregation for better performance
    const roomStats = await JamRoom.aggregate([
      { $match: { creator: mongoose.Types.ObjectId(userId) } },
      { $lookup: {
          from: 'loops',
          localField: '_id',
          foreignField: 'room',
          as: 'roomLoops'
        }
      },
      { $group: {
          _id: null,
          totalRooms: { $sum: 1 },
          totalLoops: { $sum: { $size: '$roomLoops' } },
          rooms: { $push: '$_id' }
        }
      }
    ]);
    
    // Get mixdown count
    const mixdownStats = await MixdownExport.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: {
          _id: null,
          totalMixdowns: { $sum: 1 }
        }
      }
    ]);
    
    // Extract values or use defaults
    const totalRoomsHosted = roomStats.length > 0 ? roomStats[0].totalRooms : 0;
    const totalLoops = roomStats.length > 0 ? roomStats[0].totalLoops : 0;
    const totalMixdowns = mixdownStats.length > 0 ? mixdownStats[0].totalMixdowns : 0;
    const averageLoopsPerSession = totalRoomsHosted > 0 ? 
      parseFloat((totalLoops / totalRoomsHosted).toFixed(1)) : 0;
    
    // Return stats
    res.json({
      totalRoomsHosted,
      totalLoops,
      totalMixdowns,
      averageLoopsPerSession
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;