module.exports = function validateLoop(loop) {
  if (!loop.name || !loop.audioData || !loop.roomId) {
    return false;
  }
  return true;
};
