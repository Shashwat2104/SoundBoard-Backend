const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MixdownExport = require('../models/MixdownExport');

// Record a new mixdown export
router.post('/', auth, async (req, res) => {
  try {
    const { roomId, fileName, format } = req.body;
    
    const mixdown = new MixdownExport({
      user: req.user._id,
      room: roomId,
      fileName,
      format: format || 'wav'
    });
    
    await mixdown.save();
    res.status(201).json(mixdown);
  } catch (error) {
    console.error('Error recording mixdown:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;