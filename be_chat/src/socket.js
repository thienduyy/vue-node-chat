module.exports = (http) => {
  const { Server } = require("socket.io");
  const io = new Server(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  const rooms = [];
  //find room index by room id request
  const findRoomIndex = (roomId) => {
    let roomIndex = rooms.findIndex((item) => item.roomId === roomId);
    if (roomIndex < 0) {
      let room = {
        roomId: roomId,
        messages: [],
      };
      rooms.push(room);
      roomIndex = rooms.length - 1;
    }
    return roomIndex;
  };

  io.on("connection", (socket) => {
    socket.on("message", (roomId, data) => {
      let roomIndex = findRoomIndex(roomId);

      // Add message
      rooms[roomIndex].messages.push(data);

      socket.broadcast.emit("message:received", roomId, data);
    });

    socket.on("joinRoom", (roomId) => {
      let roomIndex = findRoomIndex(roomId);
      socket.emit("message:all", rooms[roomIndex].messages);
    });

    socket.on("disconnect", () => {
      console.log(`user ${socket.id} left`);
    });
  });
};
