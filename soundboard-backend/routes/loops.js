const express = require('express');
const router = express.Router();
const { getLoopsByRoom, saveLoop } = require('../controllers/loopController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Routes
router.get('/:roomCode/loops', getLoopsByRoom);
router.post('/:roomCode/loops', authMiddleware, upload.single('audio'), saveLoop);

module.exports = router;
