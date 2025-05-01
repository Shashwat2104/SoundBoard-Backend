const { Server } = require("socket.io");

const io = new Server();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("new-loop", (loopData) => {
    io.emit("update-loops", loopData); // Send new loop to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

module.exports = io;
