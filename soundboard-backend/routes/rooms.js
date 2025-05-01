const express = require("express");
const router = express.Router();
const { createRoom, getRooms, getRoomDetails, createJamRoom, uploadTrackToRoom } = require("../controllers/roomController");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", authMiddleware, createRoom);
router.post("/jam", authMiddleware, createJamRoom);
router.get("/", getRooms);
router.get("/public", getRooms);
router.get("/:roomCode", getRoomDetails);

// Add this new route for uploading tracks
router.post("/:roomCode/tracks", authMiddleware, upload.single('file'), uploadTrackToRoom);

module.exports = router;
